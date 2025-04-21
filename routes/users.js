const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models'); // Import your Sequelize models

const User = db.User;

// --- Passport Local Strategy Setup ---
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Use email as the username field
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return done(null, false);
      }
      const passwordMatch = await bcrypt.compare(password, user.Password);
      if (!passwordMatch) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


// --- User Registration Route ---
router.post('/register', async (req, res) => {
  try {
    console.log("Request Body: ", req.body);
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await User.create({
      Email: email,
      Password: hashedPassword,
    });

        // Log the user in programmatically
        req.login(user, (err) => {
          if (err) {
            console.error('Error logging in user after registration:', err);
            return next(err);
          }
    
          // Respond with success and user info
          res.status(201).json({ message: 'User registered and logged in successfully.'});
        });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// --- User Login Route ---
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile', // Redirect to profile on success
  failureRedirect: '/login', // Redirect to login on failure
  failureFlash: true, // Enable flash messages for login failures (optional)
}), (req, res) => {
  // If authentication is successful, this function will be called.
  // You can add custom logic here if needed.
  res.json({ message: 'Login successful'});
});

router.get('/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      isAuthenticated: true,
      user: {
        id: req.user.id
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// --- Logout Route ---
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/'); // Redirect to home page after logout
  });
});

// --- Profile Route (Example - Requires Authentication) ---
router.get('/profile', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // req.user is set by passport
    res.json({ userId: req.user.id});
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// --- CRUD Operations for Users ---

// --- Read All Users ---
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

// --- Read User by ID ---
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user.' });
  }
});

// --- Update User ---
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update fields if provided
    if (email) {
      // Check if email is already in use
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ message: 'User updated successfully.', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user.' });
  }
});

// --- Delete User ---
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user.' });
  }
});

// --- Helper function to ensure user is authenticated ---
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

module.exports = router;
