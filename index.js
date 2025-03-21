const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const db = require('./models');
const routes = require('./routes'); // Import the main routes file

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the routes
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/items.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'items.html'));
});

app.get('/', (req, res) => {
  res.redirect('/items.html');
});

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