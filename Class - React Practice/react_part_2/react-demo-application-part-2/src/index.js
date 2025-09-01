import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.Fragment>
    {/* <h1>I'm from the Index.js file</h1>
    <h1 className="main-title"> styles from app.css </h1> */}
    <App />
  </React.Fragment>
);
