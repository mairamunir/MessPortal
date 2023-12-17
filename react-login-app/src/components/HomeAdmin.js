import React, { useState } from 'react';

const HomeAdmin = (props) => {
  const [allDetails, setAllDetails] = useState([]);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false); // State to show/hide the new student form
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [usernameToDelete, setUsernameToDelete] = useState('');

  //LogOut
  const handleLogout=() =>{
    localStorage.clear();
    window.location.href='/';
  }

  const handleShowAllDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3005/getAllStudentDetails`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setAllDetails(data);
      setShowAllDetails(!showAllDetails); // Toggle showAllDetails state
    } catch (e) {
      console.error(e);
    }
  };

  // Function to handle showing/hiding the new student form
  const handleToggleAddStudentForm = () => {
    setShowAddStudentForm(!showAddStudentForm);
  };

  // Function to handle adding a new student
  const handleAddStudent = async () => {
    try {
      const response = await fetch('http://localhost:3005/addStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newStudentForm.username,
          password: newStudentForm.Password,
          role: newStudentForm.Role,
          name: newStudentForm.Name,
          breakfast_count: newStudentForm.Breakfasts,
          lunch_count: newStudentForm.Lunchs,
          dinner_count: newStudentForm.Dinners,
          cash_Given: newStudentForm.Cash,
        }),
      });
  
      if (response.ok) {
        // Refresh the list of all details after adding a new student
        handleShowAllDetails();
        // Reset the form
        setShowAddStudentForm(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to add a new student:', errorData.message);
        // Display an error message to the user
        alert(`Failed to add a new student: ${errorData.message}`);
      }
    } catch (e) {
      console.error('An unexpected error occurred:', e);
      // Display an error message to the user
      alert('An unexpected error occurred. Please try again later.');
    }
  };
  

  const [newStudentForm, setNewStudentForm] = useState({
    username: '',
    password: '',
    role: '',
    name: '',
    breakfast_count: '',
    lunch_count: '',
    dinner_count: '',
    cash_given: '',
  });

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudentForm({ ...newStudentForm, [name]: value });
  };

  // Function to handle showing/hiding the delete user modal
  const handleToggleDeleteUserModal = () => {
    setShowDeleteUserModal(!showDeleteUserModal);
  };

  // Function to handle the deletion of a user
  const handleDeleteUser = async () => {
    try {
      const response = await fetch('http://localhost:3005/deleteUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameToDelete,
        }),
      });

      if (response.ok) {
        // Refresh the list of all details after deleting a user
        handleShowAllDetails();
        // Reset the input and hide the modal
        setUsernameToDelete('');
        setShowDeleteUserModal(false);
      } else {
        console.error('Failed to delete the user');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Welcome, Admin {props.userDetails.username}!</h2>
      <button onClick={handleShowAllDetails}>
        {showAllDetails ? 'Hide All Details' : 'Show All Details'}
      </button>

      {/* Button to show/hide the new student form */}
      <button style={{ marginTop: 10 }} onClick={handleToggleAddStudentForm}>
        {showAddStudentForm ? 'Hide Form' : 'Add a Student/ Start a session'}
      </button>

      {/* Button to show/hide the delete user modal */}
      <button style={{ marginTop: 10 }} onClick={handleToggleDeleteUserModal}>
        {showDeleteUserModal ? 'Cancel Delete User' : 'Delete a User'}
      </button>

      {showAddStudentForm && (
  // Form for adding a new student
  <div>
    <h3>Add a Student:</h3>
    <form style={{ maxWidth: '300px', margin: 'auto' }}>
      <label style={{ marginBottom: '3px', display: 'block' }}>ERP:</label>
      <input
        type="text"
        name="username"
        value={newStudentForm.username}
        onChange={handleNewStudentChange}
        style={{ marginBottom: '10px' }}
      />

      <label style={{ marginBottom: '3px', display: 'block' }}>Password:</label>
      <input
        type="text"
        name="Password"
        value={newStudentForm.Password}
        onChange={handleNewStudentChange}
        style={{ marginBottom: '10px' }}
      />

      <label style={{ marginBottom: '3px', display: 'block' }}>Role:</label>
      <input
        type="text"
        name="Role"
        value={newStudentForm.Role='student'}
        onChange={handleNewStudentChange}
        style={{ marginBottom: '10px' }}
      />

      <label style={{ marginBottom: '3px', display: 'block' }}>Name:</label>
      <input
        type="text"
        name="Name"
        value={newStudentForm.Name}
        onChange={handleNewStudentChange}
        style={{ marginBottom: '10px' }}
      />

      <label style={{ marginBottom: '3px', display: 'block' }}>Breakfasts:</label>
      <input
        type="text"
        name="Breakfasts"
        value={newStudentForm.Breakfasts}
        onChange={handleNewStudentChange}
        style={{ marginBottom: '10px' }}
      />

      <label style={{ marginBottom: '3px', display: 'block' }}>Lunch:</label>
      <input
        type="text"
        name="Lunchs"
        value={newStudentForm.Lunchs}
        onChange={handleNewStudentChange}
        style={{ marginBottom: '10px' }}
      />

      <label style={{ marginBottom: '3px', display: 'block' }}>Dinners:</label>
      <input
        type="text"
        name="Dinners"
        value={newStudentForm.Dinners}
        onChange={handleNewStudentChange}
        style={{ marginBottom: '10px' }}
      />

      <label style={{ marginBottom: '3px', display: 'block' }}>Cash Given:</label>
      <input
        type="text"
        name="Cash"
        value={newStudentForm.Cash}
        onChange={handleNewStudentChange}
        style={{ marginBottom: '10px' }}
      />

      <button type="button" onClick={handleAddStudent}>
        Add Student
      </button>
    </form>
  </div>
)}



      {showDeleteUserModal && (
        //  deleting a user
        <div>
          <h3>Delete a User:</h3>
          <label>Enter Username to Delete:</label>
          <input
            type="text"
            value={usernameToDelete}
            onChange={(e) => setUsernameToDelete(e.target.value)}
          />

          <button type="button" onClick={handleDeleteUser}>
            Delete User
          </button>
        </div>
      )}

{showAllDetails && (
  <div>
    <h3>All Details:</h3>
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {Array.isArray(allDetails) &&
            Object.keys(allDetails[0]).map((header, index) => (
              <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
                <strong>{header}</strong>
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(allDetails) &&
          allDetails.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)}
      <div>
        <h3>Your Details:</h3>
        <ul>
          <li>ID: {props.userDetails.id}</li>
          <li>Username: {props.userDetails.username}</li>
          <li>Role: {props.userDetails.role}</li>
          {/* Add more details as needed */}
        </ul>
      </div>
      <button style={{marginTop: 10}} onClick={handleLogout}>LogOut</button>
    </div>
    
  );
  
};

export default HomeAdmin;
