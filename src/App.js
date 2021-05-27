import React from "react";
import ReactDOM from "react-dom";

import Resources from "./Resources";

// import { Grid, GridColumn } from "@progress/kendo-react-grid";

const App = () => {
  return (
    <div>
      <h1>WUG Resource List</h1>
      <Resources></Resources>
    </div>
  );
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
