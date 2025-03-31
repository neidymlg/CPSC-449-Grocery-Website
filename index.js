require('dotenv').config(); // This line is crucial
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3307;
const db = require('./models');
const routes = require('./routes'); // Import the main routes file
const productsRoute = require('./routes/products'); // Import the products route

app.use(cors());
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
