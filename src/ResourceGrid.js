import React, { useState, useEffect } from "react";
import { Grid, GridColumn, GridToolbar, getSelectedState } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Window } from "@progress/kendo-react-dialogs";
import { Link } from "react-router-dom";
import { updateMaintenanceStatus } from "./utils/azure";
import AddMonitor from "./AddMonitor";
import { getter } from "@progress/kendo-react-common";
import "@progress/kendo-theme-material/dist/all.css";

const DATA_ITEM_KEY = "Pkey";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const selectGetter = getter(SELECTED_FIELD);
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
  const { resources, sites } = props;
  const [dataState, setDataState] = useState({});
  const [result, setResult] = useState(resources || []);
  const [selectedState, setSelectedState] = useState({});

  const [addMonitorWindowVisibility, setAddMonitorWindowVisibility] =
    useState(false);

  const toggleAddMonitorWindow = () => {
    setAddMonitorWindowVisibility(!addMonitorWindowVisibility);
  };

  useEffect(() => {
    // if (resources.length > 0 && !resources[0][DATA_ITEM_KEY]) {
    //   resources.forEach((r, index) => {
    //     resources[index][DATA_ITEM_KEY] = `${r.SiteID}-${r.ResourceID}`;
    //     resources[index][SELECTED_FIELD] = false;
    //   });
    // }

    setResult(process(resources, dataState));
    console.log(result);
  }, [resources]);

  const onDataStateChange = (event) => {
    setDataState(event.dataState);
    // setResult(process(resources, event.dataState));
    setResult(process(resources, event.dataState));
  };

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
          <AddMonitor resources={[resources[0]]} />
        </Window>
      )}
      <Grid
        data={result}
        filterable={true}
        onDataStateChange={onDataStateChange}
        {...dataState}
      >
        <GridToolbar>
          {/* <button
            title="Toggle"
            className="k-button k-primary"
            onClick={onToggleBtnClick}
          >
            Toggle Maintenance Status
          </button> */}
          <button
            title="massAssignMonitors"
            className="k-button k-primary"
            onClick={toggleAddMonitorWindow}
            disabled={sites.length !== 1 || !resources || resources.length < 1}
          >
            Add Monitor
          </button>
        </GridToolbar>

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
    </>
  );
};

export default ResourceGrid;
