import React, { useState, useEffect } from "react";
import { Grid, GridColumn, GridToolbar, getSelectedState } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Link } from "react-router-dom";
import { updateMaintenanceStatus } from "./utils/azure";
import { getter } from '@progress/kendo-react-common';
import "@progress/kendo-theme-material/dist/all.css";

const DATA_ITEM_KEY = 'Pkey';
const SELECTED_FIELD = 'selected';
const idGetter = getter(DATA_ITEM_KEY);
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

    const json = await updateMaintenanceStatus(
      TenantID,
      SiteID,
      ResourceID,
      !status
    );

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
  const [selectedState, setSelectedState] = React.useState({});
  const [dataState, setDataState] = useState({});
  const [result, setResult] = useState(resources.map(item => ({ ...item,
    [SELECTED_FIELD]: selectedState[idGetter(item)]
  })));
  // const [data, setData] = useState(resources);

  const selectionChange = event => {
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY
    });
    setSelectedState(newSelectedState);
    console.log(newSelectedState);
    //TODO: Gives warning added as result.map is not working
    var data =  Array.isArray(result) ? result : result.data;
    data.forEach(item => {
      var k = newSelectedState[item[DATA_ITEM_KEY]];
        if(k != undefined)
        item[SELECTED_FIELD] = k;
        else
        item[SELECTED_FIELD] = false;
    });
  };

  async function toggleMaintenanceStatusAsync(dataItem) {
    const { TenantID, SiteID, ResourceID } = dataItem;
    const status =
      dataItem.WorstStateInternalID === 2 && dataItem.BestStateInternalID === 2;

    await updateMaintenanceStatus(
      TenantID,
      SiteID,
      ResourceID,
      !status,
      true
    );

    console.log("Sucessfully triggered maintenance for device-"+ResourceID);
  }

  const onToggleBtnClick = event => {
    
    console.log(selectedState);
    var data =  Array.isArray(result) ? result : result.data;
    data.forEach(item => {
      var pk = item[DATA_ITEM_KEY];
      var isSelected = selectedState[pk];
        if(isSelected != undefined){
          console.log("toggling maintenance state for "+pk)
          toggleMaintenanceStatusAsync(item);
        }
    });
    // alert("Updated Maintenance Status for selected resources");
  };
 
  const headerSelectionChange = event => {
    const checked = event.syntheticEvent.target.checked;
    const newSelectedState = {};
    var data =  Array.isArray(result) ? result : result.data;
    data.forEach(item => {
      newSelectedState[idGetter(item)] = checked;
      //TODO: Gives warning added as result.map is not working
      item[SELECTED_FIELD] = checked;
    });
    setSelectedState(newSelectedState);
  };

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
      // TODO: Getting error if this line is enabled
      // data={result.map(item => ({ ...item,
      //   [SELECTED_FIELD]: selectedState[idGetter(item)]
      // }))}
      filterable={true}
      onDataStateChange={onDataStateChange}
      {...dataState}
      dataItemKey={DATA_ITEM_KEY} selectedField={SELECTED_FIELD} selectable={{
        enabled: true,
        drag: false,
        cell: false
      }} onSelectionChange={selectionChange} onHeaderSelectionChange={headerSelectionChange}>
  
      <GridToolbar>
        <button
          title="Toggle"
          className="k-button k-primary"
          onClick={onToggleBtnClick}
          >Toggle
        </button>
      </GridToolbar>
      <GridColumn field="selected" width="100px" headerSelectionValue={
        Array.isArray(result) ? 
        result.findIndex(item => !selectedState[idGetter(item)]) === -1 
        : result.data.findIndex(item => !selectedState[idGetter(item)]) === -1 
        } />
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
