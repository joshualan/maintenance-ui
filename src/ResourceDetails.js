import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import "@progress/kendo-theme-material/dist/all.css";

const ResourceDetails = () => {
  let { tenantID, siteID, resourceID } = useParams();
  const [resource, setResource] = useState({});
  const [monitors, setMonitors] = useState([
    {
      ActiveMonitorID: 8,
      ResourceID: 9,
      MonitorDisplayName: "PANG",
      MonitorDescription: "Test accessibility",
      ActiveMonitorCLSID: "2655476e-36b0-455f-9cce-940b6f8e07bf",
      ActiveMonitorTypeID: 2,
      NetworkInterfaceID: 14,
      Argument: "",
      Comment: "",
      LastStateChangeTimeLocal: "2021-06-01T15:57:20Z",
      MonitorInternalStateID: 3,
      MonitorDisabled: false,
      CriticalMonitor: false,
      id: "8",
      TenantID: "whatsupgold",
      SiteID: "atlmbarber02",
    },
  ]);

  useEffect(() => {
    requestResource();
    requestMonitors();
  }, []);

  async function requestMonitors() {
    const res = await fetch(
      `https://wugdeviceconfighandler.azurewebsites.net/api/ActiveMonitorAssignments/${tenantID}/${siteID}/${resourceID}?code=e4P0gJTxwgFifV2QPuqlSYsRp3DpbZOkKny6RkwOSBVxz2aNhJYkKA==`
    );
    const json = await res.json();
    setMonitors(json);
  }

  async function requestResource() {
    const res = await fetch(
      `https://wugdeviceconfighandler.azurewebsites.net/api/Resources/${tenantID}/${siteID}/${resourceID}?code=TgqTODssOlYchgDd7CF9uhgwJ2OP6asPbOuO/Q5cZO1BLgV5od0Iww==`
    );
    const json = await res.json();
    setResource(json[0]);
  }

  return (
    <>
      <section
        style={{
          width: "200px",
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
        <GridColumn field="ActiveMonitorID" title="Active Monitor ID" />
        <GridColumn field="MonitorDisplayName" title="Monitor Display Name" />
        <GridColumn field="MonitorDisplayName" title="Monitor Display Name" />
        <GridColumn field="MonitorDescription" title="Monitor Description" />
        <GridColumn
          field="MonitorInternalStateID"
          title="Monitor Internal State ID"
        />
      </Grid>
    </>
  );
};

export default ResourceDetails;
