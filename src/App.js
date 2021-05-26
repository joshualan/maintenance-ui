import React from "react";
import ReactDOM from "react-dom";

import DeviceGrid from "./DeviceGrid";

// import { Grid, GridColumn } from "@progress/kendo-react-grid";

const App = () => {
  return (
    <div>
      <h1>WUG Resource List</h1>
      <DeviceGrid></DeviceGrid>
    </div>
  );
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
