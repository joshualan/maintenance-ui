import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Resources from "./Resources";
import ResourceDetails from "./ResourceDetails";
import Header from "./Header";
import SelectionContext from "./SelectionContext";
import PowerBi from "./PowerBi";

import "./styles/main.css";
import "@progress/kendo-theme-material/dist/all.css";

const App = () => {
  const selection = useState({ tenant: "", sites: [] });
  return (
    <SelectionContext.Provider value={selection}>
      <Router>
        <Switch>
        <Route path="/PowerBi">
            <Header page={"Power BI"} />
            <div className="page-content">
              <PowerBi />
            </div>
          </Route>

          <Route path="/details/:tenantID/:siteID/:resourceID">
            <Header page={"Device Detail"} />
            <div className="page-content">
              <ResourceDetails />
            </div>
          </Route>
          <Route path="/">
            <Header page={"Resource List"} />
            <div className="page-content">
              <Resources />
            </div>
          </Route>


        </Switch>
      </Router>
    </SelectionContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
