import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";

import { getMonitorsForResource, getResourceInfo } from "./utils/azure";

import "@progress/kendo-theme-material/dist/all.css";

const MonitorStatusCell = (props) => {
  const { dataItem } = props;
  const { MonitorInternalStateID } = dataItem;


  return (
    <td>
      {MonitorInternalStateID === 3 ? "❌" : MonitorInternalStateID === 2 ? "🛠️" : "✔️"}
    </td>
  );
};

const ResourceDetails = () => {
  let { tenantID, siteID, resourceID } = useParams();
  const [resource, setResource] = useState({});
  const [monitors, setMonitors] = useState([]);

  useEffect(() => {
    requestResource();
    requestMonitors();
  }, []);

  async function addMonitorToResource() {
    alert("You totally added a monitor dude");
  }

  async function requestMonitors() {
    const json = await getMonitorsForResource(tenantID, siteID, resourceID);
    setMonitors(json);
  }

  async function requestResource() {
    const json = await getResourceInfo(tenantID, siteID, resourceID);
    setResource(json[0]);
  }

  return (
    <>
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

      <Grid data={monitors}>
        <GridToolbar>
          <button
            title="Add Monitor"
            className="k-button k-primary"
            onClick={addMonitorToResource}
          >
            Add Monitor
          </button>
        </GridToolbar>
        <GridColumn field="ActiveMonitorID" title="Active Monitor ID" />
        <GridColumn field="MonitorDisplayName" title="Monitor Display Name" />
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
