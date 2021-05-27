import React, { useState } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";

import "@progress/kendo-theme-material/dist/all.css";

const MaintenanceCell = (props) => {
  const {dataItem} = props;
  let inMaintenance = false;
  if (dataItem.WorstStateInternalID === 2 || dataItem.BestStateInternalID === 2) {
    inMaintenance = true; 
  }

  return inMaintenance ? (
    <td>In Maintenance <button>Toggle</button></td>
  ) : (
    <td>Not In Maintenance <button>Toggle</button></td>
    
  );
}

const ResourceGrid = (props) => {
  const {resources} = props;
  const [dataState, setDataState] = useState({});
  const [result, setResult] = useState(resources);

  const onDataStateChange = (event) => {
    setDataState(event.dataState);
    setResult(process(resources, event.dataState));
  }

  return (
    <Grid data={result}
      filterable={true}
      onDataStateChange={onDataStateChange}
      {...dataState}
    >
      <GridColumn field="DisplayName" title="Display Name" />
      <GridColumn field="ResourceID" title="Resource ID" />
      <GridColumn field="DefaultIPAddress" title="IP Address" />
      <GridColumn title="Maintenance Status" cell={MaintenanceCell} />
    </Grid>
  );
};

export default ResourceGrid;
