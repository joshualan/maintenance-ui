import React, { useState, useEffect } from "react";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { Form, FormElement } from "@progress/kendo-react-form";

import ResourceGrid from "./ResourceGrid";
import LoadingPanel from "./LoadingPanel";
import { getTenantsAndSites, getResources } from "./utils/azure";

const Resources = () => {
  const [tenant, setTenant] = useState("");
  const [tenantsList, setTenantsList] = useState([]);
  const [sites, setSites] = useState([]);
  const [siteMap, setSiteMap] = useState({});
  const [sitesList, setSitesList] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestTenants();
  }, []);

  useEffect(() => {
    setSitesList(siteMap[tenant] || []);
  }, [tenant]);

  useEffect(() => {
    setResources([]);
    requestResources();
  }, [sites]);

  async function requestTenants() {
    const json = await getTenantsAndSites();
    const m = {};

    json.forEach((s) => {
      m[s.TenantID] = m[s.TenantID] || [];
      m[s.TenantID].push(s.SiteID);
    });

    setTenantsList(Object.keys(m));
    setSiteMap(m);
  }

  async function requestResources() {
    if (!tenant || !sites) {
      return;
    }
    setLoading(true);
    var finalJson = [];
    for (const s of sites) {
      const json = await getResources(tenant, s);
      finalJson = finalJson.concat(json);
    }
    setLoading(false);
    setResources(finalJson);
  }

  const handleTenantChange = (event) => {
    setTenant(event.target.value);
  };

  const handleSiteChange = (event) => {
    setSites(event.target.value);
  };

  return (
    <div className="search-params">
      {loading && <LoadingPanel />}
      <Form
        className="k-form"
        onSubmit={requestResources}
        render={() => (
          <FormElement>
            <DropDownList
              label="Tenant"
              name="tenant"
              data={tenantsList}
              required={true}
              onChange={handleTenantChange}
            />
            <MultiSelect
              label="Site"
              name="site"
              data={sitesList}
              required={true}
              onChange={handleSiteChange}
            />
          </FormElement>
        )}
      />

      <ResourceGrid resources={resources} sites={sites}></ResourceGrid>
    </div>
  );
};

export default Resources;
