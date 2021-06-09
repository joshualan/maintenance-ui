import React, { useState, useEffect } from "react";
import {
  getMonitorsForResource,
  getMonitorsForSite,
  addMonitorToResource,
} from "./utils/azure";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import LoadingPanel from "./LoadingPanel";

const AddMonitor = (props) => {
  const { resources } = props;
  const { TenantID, SiteID } = resources[0];
  const [siteMonitors, setSiteMonitors] = useState([]);
  const [dataState, setDataState] = useState({});
  const [loading, setLoading] = useState(false);

  const resourceNames = resources.map((r) => r.DisplayName);

  // CommandCell for adding a button to assign a new monitor
  const CommandCell = (props) => {
    const { dataItem, rowType } = props;
    const [disabled, setDisabled] = useState(false);

    // if you don't do this, the groupHeader row gets an "Add" button lmao
    if (rowType === "groupHeader") {
      return null;
    }

    async function assignMonitorToResource(dataItem) {
      if (
        window.confirm(
          `Are you sure you want to assign ${
            dataItem.MonitorName
          } to ${resourceNames.join(",")}?`
        )
      ) {
        setLoading(true);
        for (const resource of resources) {
          const { id: ResourceID, DisplayName } = resource;
          const json = await addMonitorToResource(
            TenantID,
            SiteID,
            ResourceID,
            dataItem
          );

          if (json && json.data && json.data.successful === 1) {
            setDisabled(true);
            alert(
              `${dataItem.MonitorName} was successfully assigned to ${DisplayName}!.`
            );
          } else {
            alert(`An error occurred`);
          }
        }
        setLoading(false);

        // remove the monitor we just added from the list
        setSiteMonitors(
          siteMonitors.filter((value) => {
            return dataItem !== value;
          })
        );
      }
    }

    return (
      <td>
        <button
          className="k-button k-primary"
          onClick={() => assignMonitorToResource(dataItem)}
          disabled={disabled}
        >
          Add
        </button>
      </td>
    );
  };

  // Boilerplate for the Kendo UI Grid
  const initialState = {
    group: [
      {
        field: "Type",
      },
    ],
  };

  const createAppState = (dataState) => {
    return {
      result: process(siteMonitors, dataState),
      dataState: dataState,
    };
  };

  const dataStateChange = (event) => {
    setDataState(createAppState(event.dataState));
  };

  const expandChange = (event) => {
    const expandField = event.target.props.expandField || "";
    event.dataItem[expandField] = event.value;
    setDataState({ ...dataState });
  };

  useEffect(() => {
    setDataState(createAppState(initialState));
  }, [siteMonitors]);
  // End of boilerplate for the Kendo UI Grid

  useEffect(() => {
    requestMonitors();
  }, []);

  async function requestMonitors() {
    const monitorIdSet = new Set();

    setLoading(true);
    for (const resource of resources) {
      const { id: ResourceID } = resource;
      const monitorsForResource = await getMonitorsForResource(
        TenantID,
        SiteID,
        ResourceID
      );

      monitorsForResource["active"].forEach((element) => {
        monitorIdSet.add(element.ActiveMonitorCLSID);
      });

      monitorsForResource["statistical"].forEach((element) => {
        monitorIdSet.add(element.StatisticalMonitorCLSID);
      });
    }

    const monitorsForSite = await getMonitorsForSite(TenantID, SiteID);
    const monitors = [];

    monitorsForSite["active"].forEach((element) => {
      if (monitorIdSet.has(element.ActiveMonitorCLSID)) {
        return;
      }

      element.Type = "Active";
      monitors.push(element);
    });

    monitorsForSite["statistical"].forEach((element) => {
      if (monitorIdSet.has(element.StatisticalMonitorCLSID)) {
        return;
      }

      element.Type = "Statistical";
      monitors.push(element);
    });

    setSiteMonitors(monitors);
    setLoading(false);
  }

  return (
    <div>
      {loading && <LoadingPanel />}
      {TenantID} {SiteID} {resourceNames.join(", ")}
      <Grid
        resizable={true}
        reorderable={true}
        filterable={true}
        sortable={true}
        groupable={true}
        data={dataState.result}
        onDataStateChange={dataStateChange}
        {...dataState.dataState}
        onExpandChange={expandChange}
        expandField="expanded"
      >
        <GridColumn field="Type" title="Type" />
        <GridColumn field="MonitorName" title="Monitor Name" />
        <GridColumn field="MonitorDescription" title="Monitor Description" />
        <GridColumn field="id" title="Add" cell={CommandCell} width={150} />
      </Grid>
    </div>
  );
};

export default AddMonitor;
