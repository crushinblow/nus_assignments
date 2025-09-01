import React, { useState } from "react";

function ColorChanger() {
  // State for storing the color input value
  const [color, setColor] = useState("");
  // State for tracking if the color is valid
  const [isValidColor, setIsValidColor] = useState(true);

  // Function to handle input changes
  const handleColorChange = (e) => {
    const inputColor = e.target.value;
    setColor(inputColor);

    // Check if the input is a valid CSS color
    const colorElement = document.createElement("div");
    colorElement.style.color = "transparent"; // Reset
    colorElement.style.color = inputColor;
    const isValid = colorElement.style.color !== "transparent";
    setIsValidColor(isValid || inputColor === "");
  };

  // Style for the color box
  const boxStyle = {
    width: "100px",
    height: "100px",
    backgroundColor: isValidColor && color ? color : "transparent",
    border: "2px solid",
    borderColor: isValidColor ? "black" : "red",
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px" }}>
      <h2>Color Changer</h2>

      {/* Input field for color */}
      <label htmlFor="colorInput">Enter a color name: </label>
      <input
        id="colorInput"
        type="text"
        value={color}
        onChange={handleColorChange}
        placeholder="e.g., blue, #ff0000, rgb(0,255,0)"
        style={{
          marginBottom: "10px",
          borderColor: isValidColor ? "" : "red",
        }}
      />

      {/* Color display box */}
      <div style={boxStyle}>
        {!isValidColor && color && (
          <span style={{ color: "red", fontSize: "12px" }}>Invalid color</span>
        )}
      </div>

      {/* Help text */}
      <p style={{ fontSize: "12px", color: "#666" }}>
        Try: red, #00ff00, rgb(0,0,255), etc.
      </p>
    </div>
  );
}

export default ColorChanger;
