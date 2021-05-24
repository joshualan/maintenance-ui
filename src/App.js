import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return React.createElement("div", {}, [
    React.createElement("h1", {}, "Barebones React App 2021"),
    React.createElement("div", {}, "Hello, World!"),
  ]);
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
