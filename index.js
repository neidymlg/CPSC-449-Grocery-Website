const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'Grocery',
    port: 3307 
});

connection.connect((err) => {
  if (err) {
      console.error('Error connecting to MySQL database!');
      console.error('Error Code:', err.code);
      console.error('Error Message:', err.message);
      console.error('SQL State:', err.sqlState || 'N/A');

      // Check specific errors
      switch (err.code) {
          case 'ER_ACCESS_DENIED_ERROR':
              console.error('Access denied! Check username & password.');
              break;
          case 'ER_BAD_DB_ERROR':
              console.error('Database does not exist. Create it first.');
              break;
          case 'ENOTFOUND':
              console.error('MySQL host not found. Check your host setting.');
              break;
          case 'ECONNREFUSED':
              console.error('Connection refused! Is MySQL running?');
              break;
          case 'PROTOCOL_CONNECTION_LOST':
              console.error('Connection was closed unexpectedly.');
              break;
          case 'ER_CON_COUNT_ERROR':
              console.error('Too many connections to MySQL.');
              break;
          case 'ER_NOT_SUPPORTED_AUTH_MODE':
              console.error('Authentication issue! Run:');
              console.error("ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';");
              break;
          default:
              console.error('Unknown error. Try restarting MySQL.');
      }

      return;
  }
  console.log('Connected to the MySQL database.');
});

// Example query
connection.query('SELECT * FROM test', (err, results, fields) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
  }
  console.log('Query results:', results);
  console.log('Fields:', fields);
});

connection.end();
