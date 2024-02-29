const express = require('express');
const mysql = require('mysql');

const app = express();

// Create MySQL connection
const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'example',
  database: 'banking'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// Define routes
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
