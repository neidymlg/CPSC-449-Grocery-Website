const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const Store = db.Store;

// Get all stores
router.get('/stores', async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Error fetching stores' });
  }
});

// Check store location
router.get('/stores/check', async (req, res) => {
  const { LONG, LAT } = req.query;

  if (!LONG || !LAT) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const results = await Store.findAll({
      attributes: ['ID'],
      where: db.Sequelize.where(db.Sequelize.fn('ST_Distance_Sphere', db.Sequelize.col('geom_loc'), db.Sequelize.fn('ST_Point', LONG, LAT)), '<', 750)
    });
    res.json(results);
  } catch (error) {
    console.error("Error checking location:", error);
    res.status(500).json({ error: 'Error checking location' });
  }
});

// Get store by ID
router.get('/stores/:id', async (req, res) => {
  const storeId = req.params.id;
  try {
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Error fetching store' });
  }
});

// Add a new store
router.post('/stores', async (req, res) => {
  const { LONG, LAT, Name } = req.body;

  if (!LONG || !LAT || !Name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const store = await Store.create({ geom_loc: db.Sequelize.fn('ST_Point', LONG, LAT), Name });
    console.log("Store added:", store.ID);
    res.status(201).json({ id: store.ID });
  } catch (error) {
    console.error("Error adding store:", error);
    res.status(500).json({ error: 'Error adding store' });
  }
});



// Update a store
router.put('/stores/:id', async (req, res) => {
  const storeId = req.params.id;
  const { name, lat, long } = req.body;

  // Basic validation
  if (!name || !lat || !long) {
    return res.status(400).json({ error: 'Missing required fields (name, lat, long)' });
  }

  try {
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    await store.update({ name, lat, long });
    res.json({ message: 'Store updated successfully' });
  } catch (error) {
    console.error('Error updating store:', error);
    //Check for Sequelize validation errors specifically
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Error updating store' });
  }
});

// Delete a store
router.delete('/stores/:id', async (req, res) => {
  const storeId = req.params.id;
  try {
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    await store.destroy();
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ error: 'Error deleting store' });
  }
});

module.exports = router;
