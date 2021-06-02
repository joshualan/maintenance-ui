async function getTenantsAndSites() {
  const res = await fetch(
    "https://tenantsandsites.azurewebsites.net/api/Sites?code=bmuHfXVJfQ8fDLmZFiN89e2/KdQc/rIpOT/6JctxQLLTfYcydER7SQ==",
    { method: "GET", mode: "cors" }
  );

  const json = await res.json();
  return json;
}

async function getResources(tenantID, siteID) {
  const res = await fetch(
    `https://wugdeviceconfighandler.azurewebsites.net/api/Resources/${tenantID}/${siteID}?code=ohoA9yF29wlnpmZi3rmxapSi06KMfA60/QAF/oLls6/xoaL3k1sK2A==`,
    { method: "GET", mode: "cors" }
  );

  const json = await res.json();
  return json;
}

async function updateMaintenanceStatus(tenantID, siteID, resourceID, status) {
  const res = await fetch(
    `http://nmapi.azure-api.net/wugapi/${tenantID}/${siteID}/api/v1/devices/${resourceID}/config/maintenance`,
    {
      method: "PUT",
      body: JSON.stringify({
        enabled: status,
        reason: "some reason",
      }),
    }
  );
  const json = await res.json();
  return json;
}

async function getMonitorsForResource(tenantID, siteID, resourceID) {
  const res = await fetch(
    `https://wugdeviceconfighandler.azurewebsites.net/api/Monitors/${tenantID}/${siteID}/${resourceID}?code=e4P0gJTxwgFifV2QPuqlSYsRp3DpbZOkKny6RkwOSBVxz2aNhJYkKA==`
  );
  const json = await res.json();
  return json;
}

async function getResourceInfo(tenantID, siteID, resourceID) {
  const res = await fetch(
    `https://wugdeviceconfighandler.azurewebsites.net/api/Resources/${tenantID}/${siteID}/${resourceID}?code=TgqTODssOlYchgDd7CF9uhgwJ2OP6asPbOuO/Q5cZO1BLgV5od0Iww==`
  );
  const json = await res.json();
  return json;
}

async function getMonitorsForSite(tenantID, siteID) {
  const res = await fetch(
    `https://wugdeviceconfighandler.azurewebsites.net/api/Monitors/${tenantID}/${siteID}?code=x5s8KxcUkKmW1cKqSK8MICBYlvLD2r/Rexf8KCL0BKaBmaPwyzQKkw==`
  );
  const json = await res.json();
  return json;
}

async function addMonitorToResource(tenantID, siteID, resourceID, monitor) {
  const {
    ActiveMonitorTypeID,
    ActiveMonitorCLSID,
    StatisticalMonitorCLSID,
    StatisticalMonitorTypeID,
    MonitorName,
  } = monitor;

  const type = ActiveMonitorTypeID ? "active" : "performance";
  const monitorTypeId = ActiveMonitorTypeID
    ? ActiveMonitorTypeID
    : StatisticalMonitorTypeID;
  const monitorTypeClassId = ActiveMonitorCLSID
    ? ActiveMonitorCLSID
    : StatisticalMonitorCLSID;
  const res = await fetch(
    `http://nmapi.azure-api.net/wugapi/${tenantID}/${siteID}/api/v1/devices/${resourceID}/monitors/-`,
    {
      method: "POST",
      body: JSON.stringify({
        type: type,
        monitorTypeId: monitorTypeId,
        monitorTypeClassId: monitorTypeClassId,
        monitorTypeName: MonitorName,
        enabled: true,
        isGlobal: true,
        active: {
          comment: "added from AE's UI",
          argument: "",
          interfaceId: "",
          pollingIntervalSeconds: 0,
          criticalOrder: 0,
          actionPolicyId: "",
          actionPolicyName: "",
        },
        performance: {
          pollingIntervalMinutes: 1,
        },
      }),
    }
  );
  const json = await res.json();
  return json;
}

export {
  getTenantsAndSites,
  getResources,
  updateMaintenanceStatus,
  getMonitorsForResource,
  getResourceInfo,
  getMonitorsForSite,
  addMonitorToResource,
};
