import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setMessage('Please fill in all fields.');
    } else if (!email.includes('@')) {
      setMessage('Invalid email format.');
    } else {
      setMessage('Login successful!');
      // Later you can redirect or call backend API here
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login to LMS</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '10px', display: 'block' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '10px', display: 'block' }}
        />
        <button type="submit">Login</button>
      </form>
      
      {/*link to the Password Strength Checker */}
      <div style={{ marginTop: '20px', padding: '10px', borderTop: '1px solid #ccc' }}>
        <p style={{ marginBottom: '10px' }}>Want to check your password strength?</p>
        <Link 
          to="/password-checker"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Go to Password Strength Checker →
        </Link>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;