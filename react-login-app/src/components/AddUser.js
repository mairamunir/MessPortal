import React, { useState } from 'react';

const HomeUser = (props) => {
  const [userDetails, setUserDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
          oldPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        // Reset the input and hide the modal
        setOldPassword('');
        setNewPassword('');
        setShowChangePasswordModal(false);
        // You can add additional logic or messages if needed
      } else {
        console.error('Failed to change the password');
        // You can handle errors or display messages to the user
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Welcome, {props.userDetails.username}!</h2>
      <button onClick={handleShowDetails}>
        {showDetails ? 'Hide My Details' : 'Show My Details'}
      </button>

      {/* Button to show/hide the change password modal */}
      <button style={{ marginTop: 10 }} onClick={handleToggleChangePasswordModal}>
        {showChangePasswordModal ? 'Cancel Change Password' : 'Change Password'}
      </button>

      {showDetails && userDetails && (
        <div>
          <h3>Your Details:</h3>
          <ul>
            <li>ID: {userDetails.id}</li>
            <li>Username: {userDetails.username}</li>
            <li>Breakfasts: {userDetails.breakfast_count}</li>
            <li>Lunchs: {userDetails.lunch_count}</li>
            <li>Dinners: {userDetails.dinner_count}</li>
            <li>Payables: {userDetails.payables}</li>
            <li>Receivables: {userDetails.receivables}</li>
            {/* Add more details as needed */}
          </ul>
        </div>
      )}

      {showChangePasswordModal && (
        // Modal for changing the password
        <div>
          <h3>Change Password:</h3>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button type="button" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeUser;
