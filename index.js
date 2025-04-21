require('dotenv').config(); // This line is crucial
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 3307;
const db = require('./models');

// Session setup
app.use(session({
  secret: 'your_secret_key', // Replace with a secure secret
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes'); // Import the main routes file

// Mount the routes
app.use('/', routes);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
