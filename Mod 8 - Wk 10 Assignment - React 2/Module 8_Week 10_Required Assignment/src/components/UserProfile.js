import React, { useState, useEffect } from "react";
// Optional styling - import "./UserProfile.css";

function UserProfile() {
  // State to manage: - user data (null initially)
  // - loading status (true initially)
  // - error messages (null initially)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook runs when component mounts (empty dependency array [])
  useEffect(() => {
    // Async function to fetch data
    const fetchUserData = async () => {
      try {
        // Start fetching - set loading to true
        setLoading(true);

        // AJAX call using fetch API
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users/1"
        );

        // Check if response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();

        // Update state with user data
        setUser(data);
        setError(null);
      } catch (err) {
        // Handle any errors
        setError(err.message);
        setUser(null);
      } finally {
        // Regardless of success/error, loading is complete
        setLoading(false);
      }
    };

    // Call the async function
    fetchUserData();
  }, []); // Empty dependency array means this runs once on mount

  // Render different UI states based on component status
  return (
    <div className="user-profile">
      <h2>User Profile</h2>

      {loading && <div className="loading">Loading user data...</div>}

      {error && <div className="error">Error fetching user data: {error}</div>}

      {user && !loading && (
        <div className="user-data">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`
            ${user.address.street}, 
            ${user.address.suite}, 
            ${user.address.city}, 
            ${user.address.zipcode}
          `}
          </p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
