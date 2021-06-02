import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Link } from "react-router-dom";

import "@progress/kendo-theme-material/dist/all.css";

const MaintenanceCell = (props) => {
  const { dataItem } = props;
  let inMaintenance = false;
  if (
    dataItem.WorstStateInternalID === 2 ||
    dataItem.BestStateInternalID === 2
  ) {
    inMaintenance = true;
  }

  async function toggleMaintenanceStatus(dataItem) {
    const { TenantID, SiteID, ResourceID } = dataItem;
    const status =
      dataItem.WorstStateInternalID === 2 && dataItem.BestStateInternalID === 2;
    const res = await fetch(
      `http://nmapi.azure-api.net/wugapi/${TenantID}/${SiteID}/api/v1/devices/${ResourceID}/config/maintenance`,
      {
        method: "PUT",
        body: JSON.stringify({
          enabled: !status,
          reason: "some reason",
        }),
      }
    );

    const json = await res.json();

    if (json.data.success) {
      alert("Maintenance Status is now: " + !status);
    } else {
      alert("Failed to update maintenance status");
    }
  }

  return (
    <td>
      {inMaintenance ? "In Maintenance " : "Not In Maintenance "}
      <button onClick={() => toggleMaintenanceStatus(dataItem)}>Toggle</button>
    </td>
  );
};

const ResourceGrid = (props) => {
  const { resources } = props;
  const [dataState, setDataState] = useState({});
  const [result, setResult] = useState(resources);

  useEffect(() => {
    setResult(process(resources, dataState));
  }, [resources]);

  const onDataStateChange = (event) => {
    setDataState(event.dataState);
    setResult(process(resources, event.dataState));
  };

  return (
    <Grid
      data={result}
      filterable={true}
      onDataStateChange={onDataStateChange}
      {...dataState}
    >
      <GridColumn
        field="DisplayName"
        title="Display Name"
        cell={(props) => (
          <td>
            <Link
              to={`details/${props.dataItem.TenantID}/${props.dataItem.SiteID}/${props.dataItem.ResourceID}`}
            >
              {props.dataItem[props.field]}
            </Link>
          </td>
        )}
      />
      <GridColumn field="ResourceID" title="Resource ID" />
      <GridColumn field="DefaultIPAddress" title="IP Address" />
      <GridColumn title="Maintenance Status" cell={MaintenanceCell} />
    </Grid>
  );
};

export default ResourceGrid;
