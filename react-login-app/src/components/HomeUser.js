import React, { useState } from 'react';

const HomeUser = (props) => {
  const [userDetails, setUserDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
//LogOut
  const handleLogout=() =>{
    localStorage.clear();
    window.location.href='/';
  }

  const handleShowDetails = async () => {
    try {
      if (!showDetails) {
        const response = await fetch(`http://localhost:3005/getUserDetails/${props.userDetails.username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setUserDetails(data);
      }

      setShowDetails(!showDetails); // Toggle showDetails state
    } catch (e) {
      console.error(e);
    }
  };

  // Function to handle showing/hiding the change password modal
  const handleToggleChangePasswordModal = () => {
    setShowChangePasswordModal(!showChangePasswordModal);
  };

  // Function to handle changing the password
  const handleChangePassword = async () => {
    try {
      const response = await fetch('http://localhost:3005/changePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: props.userDetails.username,
          oldPassword:oldPassword,
          newPassword:newPassword,
        }),
      });

      if (response.ok) {
        // Reset the input and hide the modal
        setOldPassword('');
        setNewPassword('');
        setShowChangePasswordModal(false);
        alert('Password changed successfully!');

        // You can add additional logic or messages if needed
      } else {
        const errorData = await response.json();
        console.error('Failed to change the password:', errorData.message);
        // Display an error message to the user
        alert(`Failed to change password: ${errorData.message}`);
      }
    } catch (e) {
      console.error(e);
      // Display an error message to the user
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Welcome, {props.userDetails.Name}!</h2>
      <button onClick={handleShowDetails}>
        {showDetails ? 'Hide My Details' : 'Show My Details'}
      </button>

      {/* Button to show/hide the change password modal */}
      <button style={{ marginTop: 10 }} onClick={handleToggleChangePasswordModal}>
        {showChangePasswordModal ? 'Cancel ' : 'Change Password'}
      </button>

      {showDetails && userDetails && (
  <div>
    <h3>Your Details:</h3>
    <table className="user-details-table">
      <tbody>
        <tr>
          <td>Username:</td>
          <td>{userDetails.username}</td>
        </tr>
        <tr>
          <td>Name:</td>
          <td>{userDetails.Name}</td>
        </tr>
        <tr>
          <td>Breakfasts:</td>
          <td>{userDetails.breakfast_count}</td>
        </tr>
        <tr>
          <td>Lunches:</td>
          <td>{userDetails.lunch_count}</td>
        </tr>
        <tr>
          <td>Dinners:</td>
          <td>{userDetails.dinner_count}</td>
        </tr>
        <tr>
          <td>Payables:</td>
          <td>{userDetails.payables}</td>
        </tr>
        <tr>
          <td>Receivables:</td>
          <td>{userDetails.receivables}</td>
        </tr>
        {/* Add more details as needed */}
      </tbody>
    </table>
  </div>
  
)}




{showChangePasswordModal && (
  <div className="change-password-modal">
    <h3>Change Password:</h3>
    <div className="form-group">
      <label>Old Password:</label>
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
    </div>
    <div className="form-group">
      <label>New Password (Should be at least 6 characters with 1 capital letter and 1 digit):</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>
    <button type="button" onClick={handleChangePassword}>
      Change Password
    </button>
  </div>
)}

      <button style={{marginTop: 10}} onClick={handleLogout}>LogOut</button>
    </div>
  );
};

export default HomeUser;
