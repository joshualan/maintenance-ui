import React, { useState, useEffect } from "react";
import { getMonitorsForResource, getMonitorsForSite } from "./utils/azure";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";

const AddMonitor = (props) => {
  const { tenantID, siteID, resourceID } = props;
  const [resourceMonitors, setResourceMonitors] = useState([]);
  const [siteMonitors, setSiteMonitors] = useState([]);
  const [dataState, setDataState] = useState({});

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

  useEffect(() => {
    requestMonitors();
  }, []);

  async function requestMonitors() {
    const monitorsForResource = await getMonitorsForResource(
      tenantID,
      siteID,
      resourceID
    );
    setResourceMonitors(monitorsForResource);

    const monitorsForSite = await getMonitorsForSite(tenantID, siteID);
    const monitors = [];

    monitorsForSite["active"].forEach((element) => {
      element.Type = "Active";
      monitors.push(element);
    });

    monitorsForSite["statistical"].forEach((element) => {
      element.Type = "Statistical";
      monitors.push(element);
    });

    setSiteMonitors(monitors);
  }

  return (
    <form title="Add Monitor">
      {tenantID} {siteID} {resourceID}
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
      </Grid>
    </form>
  );
};

export default AddMonitor;
