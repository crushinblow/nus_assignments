import React from "react";
import ToggleMessage from "./components/ToggleMessage";
import ColorChanger from "./components/ColourChanger";
import UserProfile from "./components/UserProfile";
import "./styles.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="app-header">Module 8 React Hooks</h1>

      <div className="component-container">
        <h2>(1) - Toggle Message Event Handling</h2>
        <ToggleMessage />
      </div>

      <div className="component-container">
        <h2>(2) - Colour Changer State Management</h2>
        <ColorChanger />
      </div>

      <div className="component-container">
        <h2>(3) - AJAX Data Fetching</h2>
        <UserProfile />
      </div>
    </div>
  );
}

export default App;
