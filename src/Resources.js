import React, { useState, useEffect, useContext } from "react";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { Form, FormElement } from "@progress/kendo-react-form";
import { Card, CardBody } from "@progress/kendo-react-layout";
import ResourceGrid from "./ResourceGrid";
import LoadingPanel from "./LoadingPanel";
import SelectionContext from "./SelectionContext";
import { getTenantsAndSites, getResources } from "./utils/azure";

const Resources = () => {
  const [tenant, setTenant] = useState("");
  const [tenantsList, setTenantsList] = useState([]);
  const [sites, setSites] = useState([]);
  const [siteMap, setSiteMap] = useState({});
  const [sitesList, setSitesList] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useContext(SelectionContext);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    setSitesList(siteMap[tenant] || []);
  }, [tenant]);

  useEffect(() => {
    setResources([]);
    requestResources();
  }, [sites]);

  async function initialize() {
    await requestTenants();
    if (selection.tenant) {
      setTenant(selection.tenant);
    }
    if (selection.sites.length > 0) {
      setSites(selection.sites);
    }
  }

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
    setSelection({ tenant: event.target.value, sites: selection.sites });
  };

  const handleSiteChange = (event) => {
    setSites(event.target.value);
    setSelection({ tenant: tenant, sites: event.target.value });
  };

  return (
    <div className="search-params">
      {loading && <LoadingPanel />}
      <Card>
        <CardBody>
          <Form
            className="k-form"
            onSubmit={requestResources}
            render={() => (
              <FormElement>
                <DropDownList
                  label="Tenant"
                  name="tenant"
                  data={tenantsList}
                  value={tenant}
                  required={true}
                  onChange={handleTenantChange}
                />
                <MultiSelect
                  label="Site"
                  name="site"
                  data={sitesList}
                  required={true}
                  value={sites}
                  onChange={handleSiteChange}
                />
              </FormElement>
            )}
          />

          <ResourceGrid resources={resources} sites={sites}></ResourceGrid>
        </CardBody>
      </Card>
    </div>
  );
};

export default Resources;
