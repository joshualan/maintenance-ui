import React, { useState, useEffect } from "react";

import ResourceGrid from "./ResourceGrid";

const Resources = () => {
  const [tenant, setTenant] = useState("");
  const [tenantsList, setTenantsList] = useState([]);
  const [site, setSite] = useState("");
  const [siteMap, setSiteMap] = useState({});
  const [sitesList, setSitesList] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    requestTenants();
  }, []);

  useEffect(() => {
    setSitesList(siteMap[tenant] || []);
  }, [tenant]);

  async function requestTenants() {
    const res = await fetch(
      "https://tenantsandsites.azurewebsites.net/api/Sites?code=bmuHfXVJfQ8fDLmZFiN89e2/KdQc/rIpOT/6JctxQLLTfYcydER7SQ==",
      { method: "GET", mode: "cors" }
    );

    const json = await res.json();
    const m = {};

    json.forEach((s) => {
      m[s.TenantID] = m[s.TenantID] || [];
      m[s.TenantID].push(s.SiteID);
    });

    setTenantsList(Object.keys(m));
    setSiteMap(m);
  }

  async function requestResources() {
    if (!tenant || !site) {
      return;
    }

    const res = await fetch(
      `https://wugdeviceconfighandler.azurewebsites.net/api/Resources/${tenant}/${site}?code=ohoA9yF29wlnpmZi3rmxapSi06KMfA60/QAF/oLls6/xoaL3k1sK2A==`,
      { method: "GET", mode: "cors" }
    );

    const json = await res.json();
    setResources(json);
  }

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestResources();
        }}
      >
        <label htmlFor="tenant">
          Tenant
          <select
            id="tenant"
            onChange={(e) => setTenant(e.target.value)}
            onBlur={(e) => setTenant(e.target.value)}
            value={tenant}
          >
            <option value=""></option>
            {tenantsList.map((tenant) => (
              <option value={tenant} key={tenant}>
                {tenant}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="sites">
          Site
          <select
            id="sites"
            onChange={(e) => setSite(e.target.value)}
            onBlur={(e) => setSite(e.target.value)}
            value={site}
          >
            <option value=""></option>
            {sitesList.map((site) => (
              <option value={site} key={site}>
                {site}
              </option>
            ))}
          </select>
          <button>Submit</button>
        </label>
      </form>

      <ResourceGrid resources={resources}></ResourceGrid>
    </div>
  );
};

export default Resources;
