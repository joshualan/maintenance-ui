import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { Window } from "@progress/kendo-react-dialogs";
import { process } from "@progress/kendo-data-query";

import {
  getMonitorsForResource,
  getResourceInfo,
  getMonitorsForSite,
} from "./utils/azure";
import AddMonitor from "./AddMonitor";

import "@progress/kendo-theme-material/dist/all.css";

const MonitorStatusCell = (props) => {
  const { dataItem } = props;
  const { MonitorInternalStateID } = dataItem;

  return (
    <td>
      {MonitorInternalStateID === 3
        ? "❌"
        : MonitorInternalStateID === 2
        ? "🛠️"
        : "✔️"}
    </td>
  );
};

const ResourceDetails = () => {
  let { tenantID, siteID, resourceID } = useParams();
  const [resource, setResource] = useState({});
  const [resourceMonitors, setResourceMonitors] = useState([]);
  const [addMonitorWindowVisibility, setAddMonitorWindowVisibility] =
    useState(false);

  useEffect(() => {
    requestResource();
    requestMonitors();
  }, []);

  const toggleAddMonitorWindow = () => {
    setAddMonitorWindowVisibility(!addMonitorWindowVisibility);
  };

  async function requestMonitors() {
    const monitorsForResource = await getMonitorsForResource(
      tenantID,
      siteID,
      resourceID
    );
    setResourceMonitors(monitorsForResource);
  }

  async function requestResource() {
    const json = await getResourceInfo(tenantID, siteID, resourceID);
    setResource(json[0]);
  }

  return (
    <>
      {addMonitorWindowVisibility && (
        <Window
          title="Add Monitor"
          modal={true}
          onClose={toggleAddMonitorWindow}
          initialWidth={1500}
          initialHeight={1200}
          resizable={true}
        >
          <AddMonitor
            tenantID={tenantID}
            siteID={siteID}
            resourceID={resourceID}
          />
        </Window>
      )}

      <section
        style={{
          width: "20%",
          float: "left",
        }}
      >
        <p>
          <strong>TenantID:</strong> {resource.TenantID}
        </p>

        {Object.keys(resource).map((field) => (
          <p key={field}>
            <strong>{field}:</strong> {resource[field]}
          </p>
        ))}
      </section>

      <Grid data={resourceMonitors}>
        <GridToolbar>
          <button
            title="Add Monitor"
            className="k-button k-primary"
            onClick={toggleAddMonitorWindow}
          >
            Add Monitor
          </button>
        </GridToolbar>
        <GridColumn field="MonitorDisplayName" title="Monitor Display Name" />
        <GridColumn field="MonitorDescription" title="Monitor Description" />
        <GridColumn
          field="MonitorInternalStateID"
          title="Monitor Internal State ID"
          cell={MonitorStatusCell}
        />
      </Grid>
    </>
  );
};

export default ResourceDetails;
