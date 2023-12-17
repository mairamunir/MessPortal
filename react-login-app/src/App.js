// src/App.js
import React, { useState } from 'react';
import Login from './components/Login';
import HomeAdmin from './components/HomeAdmin';
import HomeUser from './components/HomeUser';
import "./App.css"

function App() {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <div className="App">
      {userDetails === null
        ? <Login setUserDetails={setUserDetails} />
        : renderHomeComponent(userDetails)}
    </div>
  );

  function renderHomeComponent(userDetails) {
    // Assuming there is a userType property in userDetails
    const userType = userDetails.role;

    switch (userType) {
      case 'admin':
        return <HomeAdmin userDetails={userDetails} />;
      case 'student':
        return <HomeUser userDetails={userDetails} />;
      default:
        return
    }
  }
}

export default App;
console.log("Hello World")