import React, { useState } from 'react';

function PasswordStrength() {
  const [password, setPassword] = useState('');
  const [strengthMessage, setStrengthMessage] = useState('');

  const checkPasswordStrength = () => {
    if (password.length < 6) {
      setStrengthMessage('Weak password');
    } else if (password.length >= 6 && /\d/.test(password)) {
      setStrengthMessage('Strong password');
    } else {
      setStrengthMessage('Medium password - add numbers to make it stronger');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Password Strength Checker</h2>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '10px', display: 'block', padding: '8px', width: '250px' }}
      />
      <button 
        onClick={checkPasswordStrength}
        style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Check Strength
      </button>
      {strengthMessage && (
        <p style={{ 
          marginTop: '10px', 
          fontWeight: 'bold',
          color: strengthMessage.includes('Weak') ? 'red' : 
                 strengthMessage.includes('Strong') ? 'green' : 'orange'
        }}>
          {strengthMessage}
        </p>
      )}
    </div>
  );
}

export default PasswordStrength;