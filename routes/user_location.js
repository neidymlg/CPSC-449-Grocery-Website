const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const User_Location = db.User_Location; // Ensure the correct model name

// Add a new user location
router.post('/user_locations', async (req, res) => {
  const { UserID, LONG, LAT } = req.body;

  if (!UserID || !LONG || !LAT) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userLocation = await User_Location.create({ User_ID: UserID, user_loc: db.Sequelize.fn('ST_Point', LONG, LAT) });
    console.log("User Location added:", userLocation.ID);
    res.status(201).json({ id: userLocation.ID });
  } catch (error) {
    console.error("Error adding user location:", error);
    res.status(500).json({ error: 'Error adding user location' });
  }
});

// Check user location
router.get('/user_locations/check', async (req, res) => {
  const { LONG, LAT } = req.query;

  if (!LONG || !LAT) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const results = await User_Location.findAll({
      attributes: [[db.Sequelize.fn('COUNT', db.Sequelize.col('*')), 'Amount_Nearby']],
      where: db.Sequelize.where(db.Sequelize.fn('ST_Distance_Sphere', db.Sequelize.col('user_loc'), db.Sequelize.fn('ST_Point', LONG, LAT)), '<', 750)
    });
    res.json(results);
  } catch (error) {
    console.error("Error checking location:", error);
    res.status(500).json({ error: 'Error checking location' });
  }
});

module.exports = router;