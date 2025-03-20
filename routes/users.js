const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models'); // Import your Sequelize models
const User = db.User;


// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/', // Redirect to home page after successful login
    failureRedirect: '/login', // Redirect to login page on failure
  }));

router.get('/logout', (req, res) => {
  req.logout(); // Use req.logout() from passport
  res.redirect('/'); // Redirect to home page after logout
});


//Example route to check if user is logged in (requires authentication)
router.get('/profile', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // req.user is set by passport
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});


// Helper function to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}


module.exports = router;
