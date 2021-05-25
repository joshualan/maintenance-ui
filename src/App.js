import React from "react";
import ReactDOM from "react-dom";
import "@progress/kendo-theme-material/dist/all.css";

import DeviceGrid from './DeviceGrid';

// import { Grid, GridColumn } from "@progress/kendo-react-grid";

const App = () => {
  // return React.createElement("div", {}, [
  //   React.createElement("h1", {}, "Barebones React App 2021"),
  //   React.createElement("div", {}, "Hello, World!"),
  // ]);

  return (
    <div>
      <h1> Barebones React App 2021 </h1>
      Hello, World!
      <DeviceGrid></DeviceGrid>
    </div>
  );
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
