import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { Window } from "@progress/kendo-react-dialogs";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
} from "@progress/kendo-react-layout";

import {
  getMonitorsForResource,
  getResourceInfo,
  updateMaintenanceStatus,
} from "./utils/azure";
import { getEmojiFromMonitorStatus } from "./utils/emoji";
import AddMonitor from "./AddMonitor";
import LoadingPanel from "./LoadingPanel";

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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    const json = await updateMaintenanceStatus(
      tenantID,
      siteID,
      resourceID,
      !status
    );

    if (json.data.success) {
      alert("Maintenance Status is now: " + !status);
    } else {
      alert("Failed to update maintenance status");
    }
    setLoading(false);
  }

  async function requestMonitors() {
    setLoading(true);

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
    setLoading(false);
  }

  async function requestResource() {
    setLoading(true);
    const json = await getResourceInfo(tenantID, siteID, resourceID);
    setResource(json[0]);
    setLoading(false);
  }

  return (
    <>
      {addMonitorWindowVisibility && (
        <Window
          title="Add Monitor"
          modal={true}
          onClose={toggleAddMonitorWindow}
          initialWidth={1000}
          initialHeight={1000}
          resizable={true}
        >
          <AddMonitor resources={[resource]} />
        </Window>
      )}
      {loading && <LoadingPanel />}
      <Card>
        <CardTitle>{resource.DisplayName}</CardTitle>
        <CardSubtitle>Display Name</CardSubtitle>
        <CardBody>
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
            <GridColumn
              field="MonitorDisplayName"
              title="Monitor Display Name"
            />
            <GridColumn
              field="MonitorDescription"
              title="Monitor Description"
            />
            <GridColumn
              field="MonitorInternalStateID"
              title="Monitor Internal State ID"
              cell={MonitorStatusCell}
            />
          </Grid>
        </CardBody>
      </Card>
      {/* <div className="k-card-deck">
        <Card className="device-detail-card">
          <CardSubtitle className="device-detail-subtitle">
            {"Type"}
          </CardSubtitle>
          <CardBody>
            <h1 className="device-detail-h1"> {resource["ResourceType"]}</h1>{" "}
          </CardBody>
        </Card>

        <Card className="device-detail-card">
          <CardSubtitle className="device-detail-subtitle">{"ID"}</CardSubtitle>
          <CardBody>
            <h1 className="device-detail-h1"> {resource["id"]}</h1>{" "}
          </CardBody>
        </Card>

        <Card className="device-detail-card">
          <CardSubtitle className="device-detail-subtitle">
            {"Host Name"}
          </CardSubtitle>
          <CardBody>
            <h1 className="device-detail-h1"> {resource["DefaultHostName"]}</h1>{" "}
          </CardBody>
        </Card>
      </div>
      <div className="k-card-deck">
        <Card className="device-detail-card">
          <CardSubtitle className="device-detail-subtitle">
            {"Tenant"}
          </CardSubtitle>
          <CardBody>
            <h1 className="device-detail-h1"> {resource["TenantID"]}</h1>{" "}
          </CardBody>
        </Card>

        <Card className="device-detail-card">
          <CardSubtitle className="device-detail-subtitle">
            {"Site"}
          </CardSubtitle>
          <CardBody>
            <h1 className="device-detail-h1"> {resource["SiteID"]}</h1>{" "}
          </CardBody>
        </Card>

        <Card className="device-detail-card">
          <CardSubtitle className="device-detail-subtitle">
            {"Maintenance Status"}
          </CardSubtitle>
          <CardBody>
            <big>
              <big>
                {getEmojiFromMonitorStatus(
                  resource.WorstStateInternalID === 2 &&
                    resource.BestStateInternalID === 2
                    ? 2
                    : 3
                )}{" "}
              </big>
            </big>{" "}
            <button
              onClick={() => toggleMaintenanceStatus()}
              className="k-button k-primary"
            >
              Toggle
            </button>{" "}
          </CardBody>
        </Card>
      </div> */}
    </>
  );
};

export default ResourceDetails;
