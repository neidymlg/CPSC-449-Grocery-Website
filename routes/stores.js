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

// Create a new store
router.post('/stores', async (req, res) => {
  const { name, lat, long } = req.body;

  // Basic validation
  if (!name || !lat || !long) {
    return res.status(400).json({ error: 'Missing required fields (name, lat, long)' });
  }

  try {
    const store = await Store.create({ name, lat, long });
    res.status(201).json(store);
  } catch (error) {
    console.error('Error creating store:', error);
    //Check for Sequelize validation errors specifically
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Error creating store' });
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
