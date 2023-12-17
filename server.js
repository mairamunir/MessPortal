const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3005;

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dawood@7515',
  database: 'mydata',
});

db.connect();

// API endpoint to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check the username and password against the database
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.query(query, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful', userDetails: results[0] });
    } else {
      res.json({ success: false, message: 'Login failed' });
    }
  });
});

// API endpoint in your server.js file to handle the request for fetching all details for students
app.get('/getAllStudentDetails', (req, res) => {
  const query = 'SELECT username, Name, breakfast_count, lunch_count, dinner_count, total_amount, cash_given, payables, receivables FROM users WHERE role = "student"'; 

  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


// API endpoint to handle adding a new student
app.post('/addStudent', (req, res) => {
  const {
    username,
    password,
    role,
    name,
    breakfast_count,
    lunch_count,
    dinner_count,
    cash_Given,
  } = req.body;

  const query = `
    INSERT INTO users 
    (username, password, role, Name, breakfast_count, lunch_count, dinner_count, cash_given) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [username, password, role, name, breakfast_count, lunch_count, dinner_count, cash_Given],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add a new student' });
      } else {
        res.status(200).json({ success: true, message: 'New student added successfully' });
      }
    }
  );
});


//Creating API for Showing user details
app.get('/getUserDetails/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `SELECT * FROM users WHERE username = '${userId}'`;

  db.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.json(results[0]); // Assuming there's only one user with the given ID
  });
});


// API endpoint to handle deleting a user
app.delete('/deleteUser', (req, res) => {
  const { username } = req.body;

  const query = 'DELETE FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to delete the user' });
    } else {
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    }
  });
});
// API endpoint to handle starting a new session
app.post('/startNewSession', (req, res) => {
  try {
    const {
      username,
      breakfast_count,
      lunch_count,
      dinner_count,
      cash_given
    } = req.body;

    // Validate the inputs (you may want to add more validation logic)
    if (!username || !breakfast_count || !lunch_count || !dinner_count || !cash_given) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Please provide all required fields.'
      });
    }

    // Calculate total_amount based on the provided counts
    const total_amount = (breakfast_count * 150) + (lunch_count * 200) + (dinner_count * 250);

    // Update the database
    const updateQuery = `
      UPDATE users
      SET
        breakfast_count = ?,
        lunch_count = ?,
        dinner_count = ?,
        total_amount = ?,
        cash_given = ?,
        receivables = 
          CASE
            WHEN ? < ? THEN receivables + (? - ?)
            ELSE receivables - (? - ?)
          END,
        payables = 
          CASE
            WHEN ? > ? THEN payables - (? - ?)
            ELSE payables + (? - ?)
          END
      WHERE username = ?;
    `;

    db.query(
      updateQuery,
      [
        breakfast_count,
        lunch_count,
        dinner_count,
        total_amount,
        cash_given,
        cash_given,
        total_amount,
        cash_given,
        total_amount,
        cash_given,
        total_amount,
        payables,
        cash_given,
        total_amount,
        cash_given,
        total_amount,
        username
      ],
      (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({
            success: false,
            message: 'Failed to start a new session. Internal Server Error.'
          });
        } else {
          return res.status(200).json({
            success: true,
            message: 'New session started successfully.'
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.'
    });
  }
});

// API endpoint to handle changing the password
app.put('/changePassword', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  console.log(username);
  // Validate the old password (you may want to improve the validation logic)
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, oldPassword], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to change the password' });
    } else if (results.length === 0) {
      res.status(401).json({ success: false, message: 'Old password does not match' });
    } else if (newPassword.length < 6 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long and contain at least one digit and one alphabet.',
      });
    } else {
      // Update the password
      const updateQuery = 'UPDATE users SET password = ? WHERE username = ?';

      db.query(updateQuery, [newPassword, username], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          res.status(500).json({ success: false, message: 'Failed to change the password' });
        } else {
          res.status(200).json({ success: true, message: 'Password changed successfully' });
        }
      });
    }
  });
});
  //handle logout
  const handleLogout=() =>{
    localStorage.clear();
    window.location.href='/';
  }



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});