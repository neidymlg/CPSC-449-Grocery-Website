// https://hectorcorrea.com/blog/2013-01-15/introduction-to-node-js
//keep in this file so it runs with the localhost/when website first starts
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
import { startPool, testConnection, closePool, addProduct } from './Grocery_db.js';
const app = express();
const port = 3000;
const db = require('./models');
const routes = require('./routes'); // Import the main routes file

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the routes
app.use('/', routes);

// Test the database connection
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
