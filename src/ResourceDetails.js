import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { Window } from "@progress/kendo-react-dialogs";

import {
  getMonitorsForResource,
  getResourceInfo,
  updateMaintenanceStatus,
} from "./utils/azure";
import { getEmojiFromMonitorStatus } from "./utils/emoji";
import AddMonitor from "./AddMonitor";

import "@progress/kendo-theme-material/dist/all.css";

const MonitorStatusCell = (props) => {
  const { dataItem } = props;
  const { MonitorInternalStateID } = dataItem;
  return <td>{getEmojiFromMonitorStatus(MonitorInternalStateID)}</td>;
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

    // if we just toggled it off, grab new data.
    if (!addMonitorWindowVisibility) {
      requestMonitors();
    }
  };

  async function toggleMaintenanceStatus() {
    const { BestStateInternalID, WorstStateInternalID } = resource;
    const status = WorstStateInternalID === 2 && BestStateInternalID === 2;

    const json = await updateMaintenanceStatus(
      tenantID,
      siteID,
      resourceID,
      !status
    );

    if (json.data.success) {
      alert("Maintenance Status is now: " + !status);
      setTimeout(requestResource, 3000);
    } else {
      alert("Failed to update maintenance status");
    }
  }

  async function requestMonitors() {
    const json = await getMonitorsForResource(tenantID, siteID, resourceID);
    const monitors = [];

    json["active"].forEach((element) => {
      element.Type = "Active";
      monitors.push(element);
    });

    json["statistical"].forEach((element) => {
      element.Type = "Statistical";
      monitors.push(element);
    });
    setResourceMonitors(monitors);
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
          <AddMonitor resource={resource} />
        </Window>
      )}

      <section
        style={{
          width: "20%",
          float: "left",
        }}
      >
        {Object.keys(resource).map((field) => (
          <p key={field}>
            {field === "WorstStateInternalID" ||
            field === "BestStateInternalID" ? (
              <>
                {" "}
                <strong>{field}: </strong>{" "}
                {getEmojiFromMonitorStatus(resource[field])}{" "}
              </>
            ) : (
              <>
                {" "}
                <strong>{field}: </strong> {resource[field]}{" "}
              </>
            )}
          </p>
        ))}

        <p>
          <strong>Maintenance Status: </strong>{" "}
          {getEmojiFromMonitorStatus(
            resource.WorstStateInternalID === 2 &&
              resource.BestStateInternalID === 2
              ? 2
              : 3
          )}
          <button
            onClick={() => toggleMaintenanceStatus()}
            className="k-button k-primary"
          >
            Toggle
          </button>
        </p>
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
