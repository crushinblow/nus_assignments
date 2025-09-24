import React, { useState } from 'react';

function CourseToggle() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleDescription = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>React Fundamentals Course</h2>
      
      <button 
        onClick={toggleDescription}
        style={{
          padding: '10px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        {isVisible ? 'Hide Description' : 'Show Description'}
      </button>

      {isVisible && (
        <p style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          lineHeight: '1.6'
        }}>
          This course covers React fundamentals including components, JSX, and props.
          You'll learn how to build modern web applications using React's component-based architecture.
        </p>
      )}
    </div>
  );
}

export default CourseToggle;