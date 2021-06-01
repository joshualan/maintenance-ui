import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Resources from "./Resources";
import ResourceDetails from "./ResourceDetails";

const App = () => {
  return (
    <div>
      <Router>
        <header>
          <Link to="/">
            <h1>WUG Resource List</h1>
          </Link>
        </header>
        <Switch>
          <Route path="/details/:tenantID/:siteID/:resourceID">
            <ResourceDetails />
          </Route>
          <Route path="/">
            <Resources></Resources>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
