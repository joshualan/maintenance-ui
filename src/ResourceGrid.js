import React, { useState, useEffect } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
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
const MaintenanceCell = (props) => {
  const { dataItem } = props;
  let inMaintenance = false;

  if (
    dataItem.WorstStateInternalID === 2 ||
    dataItem.BestStateInternalID === 2
  ) {
    inMaintenance = true;
  }

  return <td>{inMaintenance ? "In Maintenance " : "Not In Maintenance "}</td>;
};

const ResourceGrid = (props) => {
  const { resources, sites } = props;
  const [dataState, setDataState] = useState({});
  const [result, setResult] = useState(resources || []);
  const [selectedState, setSelectedState] = useState({});
  const [selectedResources, setSelectedResources] = useState([]);

  const [addMonitorWindowVisibility, setAddMonitorWindowVisibility] =
    useState(false);

  const toggleAddMonitorWindow = () => {
    setAddMonitorWindowVisibility(!addMonitorWindowVisibility);
  };

  async function onToggleBtnClick() {
    for (const resource of selectedResources) {
      const { TenantID, SiteID, ResourceID } = resource;

      const status =
        resource.WorstStateInternalID === 2 &&
        resource.BestStateInternalID === 2;

      const json = await updateMaintenanceStatus(
        TenantID,
        SiteID,
        ResourceID,
        !status
      );

      if (json && json.data && json.data.success) {
        alert(
          `Maintenance Status of ${resource.DisplayName} is now ${!status}`
        );
      } else {
        alert(`Failed to update maintenance status of ${resource.DisplayName}`);
      }
    }
  }

  useEffect(() => {
    resources.forEach((r, index) => {
      resources[index][DATA_ITEM_KEY] = `${r.SiteID}-${r.ResourceID}`;
      resources[index][SELECTED_FIELD] = false;
    });

    setResult(process(resources, dataState));
  }, [resources]);

  useEffect(() => {
    setSelectedResources(resources.filter((r) => selectedState[idGetter(r)]));
  }, [selectedState]);

  const onDataStateChange = (event) => {
    setDataState(event.dataState);
    setResult(process(resources, event.dataState));
  };

  const selectionChange = (event) => {
    // getSelectedState() is garbage, never use it
    const newSelectedState = { ...selectedState };
    newSelectedState[event.dataItem[DATA_ITEM_KEY]] =
      event.syntheticEvent.target.checked;
    setSelectedState(newSelectedState);
    event.dataItem[SELECTED_FIELD] = !event.dataItem[SELECTED_FIELD];
  };

  const headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const newSelectedState = {};
    resources.forEach((item) => {
      newSelectedState[idGetter(item)] = checked;
      item[SELECTED_FIELD] = checked;
    });
    setSelectedState(newSelectedState);
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
          <AddMonitor resources={selectedResources} />
        </Window>
      )}
      <Grid
        data={result}
        filterable={true}
        onDataStateChange={onDataStateChange}
        {...dataState}
        dataItemKey={DATA_ITEM_KEY}
        selectedField={SELECTED_FIELD}
        selectable={{
          enabled: true,
          drag: false,
          cell: false,
        }}
        onSelectionChange={selectionChange}
        onHeaderSelectionChange={headerSelectionChange}
      >
        <GridToolbar>
          <button
            title="Toggle"
            className="k-button k-primary"
            onClick={onToggleBtnClick}
            disabled={selectedResources.length < 1}
          >
            Toggle Maintenance Status
          </button>
          <button
            title="massAssignMonitors"
            className="k-button k-primary"
            onClick={toggleAddMonitorWindow}
            disabled={selectedResources.length < 1}
          >
            Add Monitor
          </button>
        </GridToolbar>
        <GridColumn
          field="selected"
          width="150px"
          headerSelectionValue={
            resources.findIndex((item) => !selectedState[idGetter(item)]) === -1
          }
        />
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
