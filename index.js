require('dotenv').config(); // This line is crucial
const express = require('express');
const app = express();
const port = process.env.PORT || 3307;
const db = require('./models');
const routes = require('./routes'); // Import the main routes file

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the routes
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
