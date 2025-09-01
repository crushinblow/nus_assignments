import React from "react";
import ReactDOM from "react-dom/client";
import TodoApp from "./containers/TodoApp";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>
);
