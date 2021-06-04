import React, { useState, useEffect } from "react";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";

import ResourceGrid from "./ResourceGrid";
import { getTenantsAndSites, getResources } from "./utils/azure";

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
    if (!tenant || !site) {
      return;
    }

    var finalJson = [];
    if(Array.isArray(site)){
      for(const s of site){
        const json = await getResources(tenant, s);
        finalJson = finalJson.concat(json);
      }
    } else {
      finalJson = await getResources(tenant, site);
    }
    finalJson.forEach (item => {
      //set a unique key with <tenant id>::<site id>::<resource id>
      item["Pkey"] = item["TenantID"] + "::" + item["SiteID"] + "::" + item["ResourceID"];
    });
    console.log(finalJson);
    setResources(finalJson);
  }

  const handleTenantChange = (event) => {
    setTenant(event.target.value);
  };

  const handleSiteChange = (event) => {
    setSite(event.target.value);
  };

  return (
    <div className="search-params">
      <form
        className="k-form"
        onSubmit={(e) => {
          e.preventDefault();
          requestResources();
        }}
      >
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
        <button className="k-button k-primary">Submit</button>
      </form>

      <ResourceGrid resources={resources}></ResourceGrid>
    </div>
  );
};

export default Resources;
