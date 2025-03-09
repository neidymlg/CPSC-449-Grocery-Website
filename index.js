const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'Grocery',
    port: 3307 
};

const mysql = require('mysql2/promise');

// Function to retry connection
async function connectWithRetry(retries = 10, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempt ${i + 1}: Connecting to MySQL...`);
            const connection = await mysql.createConnection(dbConfig);
            console.log("✅ Connected to MySQL");
            return connection;
        } catch (err) {
            console.error(`Connection failed. Retrying in ${delay / 1000} seconds...`, err.code);

            // Handle specific MySQL errors
            switch (err.code) {
                case 'ER_ACCESS_DENIED_ERROR':
                    console.error('Access denied. Check username & password.');
                    break;
                case 'ER_BAD_DB_ERROR':
                    console.error('Database does not exist.');
                    break;
                case 'ENOTFOUND':
                    console.error('MySQL host not found. Check your host setting.');
                    break;
                case 'ECONNREFUSED':
                    console.error('Connection refused! Is MySQL running?');
                    break;
                case 'PROTOCOL_CONNECTION_LOST':
                    console.error('Connection lost! Retrying...');
                    break;
                case 'ER_CON_COUNT_ERROR':
                    console.error('Too many connections to MySQL.');
                    break;
                case 'ER_NOT_SUPPORTED_AUTH_MODE':
                    console.error('Authentication issue.');
                    break;
                default:
                    console.error('Unknown error.');
            }

            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw new Error("Failed to connect to MySQL after multiple attempts.");
}

// Start the application
(async () => {
    try {
        const connection = await connectWithRetry();
        console.log("Database is ready. Starting application...");

        // Run a test query
        try {
            const [results, fields] = await connection.query('SELECT * FROM test');
            console.log('Query results:', results);
            console.log('Fields:', fields);
        } catch (err) {
            console.error('Error executing query:', err);
        }

        await connection.end();  // Properly close the connection
    } catch (error) {
        console.error(error);
        process.exit(1);  // Exit if unable to connect
    }
})();
