// src/components/Login.js
import React, { useState } from 'react';
import './Login.css'; // Import the CSS file


const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  let name = "25252";

  const obj = {
    abc: "xyz"
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3005/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      const success = data.success;
      const userDetails = data.userDetails;
      if (success) {
        props.setUserDetails(userDetails)
      }
      setMessage(data.message);
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <div className="container">
      <h1>MESS PORTAL</h1>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="ERP/ADMIN"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
};

export default Login;