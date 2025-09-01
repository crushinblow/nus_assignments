// Import necessary React features
import React, { useState } from "react";

// Define ToggleMessage component
function ToggleMessage() {
  /*
   * State Management:  destructure the returned array into showMessage 
  (current state) and setShowMessage (state updater function)
   * -> showMessage: tracks if message should be visible
   * -> setShowMessage: function to update the showMessage state
   * Using useState hook to manage component state
   */
  const [showMessage, setShowMessage] = useState(false);

  /*
   * Event Handler Function:
   * - toggleMessage: called when button is clicked
   * - Toggles the showMessage state between true and false
   * - Uses the functional update pattern to ensure correct state updates
   */
  const toggleMessage = () => {
    setShowMessage((prevState) => !prevState);
  };

  // Component return
  return (
    <div>
      {/*
       * Button Element:pass the function reference directly
       * - onClick event is bound to toggleMessage handler
       * - When clicked, it will show/hide the message
       */}
      <button onClick={toggleMessage}>Toggle Message</button>

      {/*
       * Conditional Message Rendering:
       * - logical AND (&&) operator for conditional rendering
       * - Only renders the <p> element when showMessage is true
       * - Message disappears when showMessage becomes false
       */}
      {showMessage && <p>Hello, welcome to React!</p>}
    </div>
  );
}

// Export the component for use in other files
export default ToggleMessage;
