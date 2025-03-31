const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const Item = db.Item; // Ensure the correct model name

// Add a new item
router.post('/items', async (req, res) => {
  const { StoreID, ProductID, Name, Price } = req.body;

  if (!StoreID || !ProductID || !Name || !Price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const item = await Item.create({ Store_ID: StoreID, Product_ID: ProductID, Name, Price });
    console.log("Store item added:", item.ID);
    res.json({ id: item.ID });
  } catch (error) {
    console.error("Error adding store item:", error);
    res.status(500).json({ error: 'Error adding store item' });
  }
});

// Check item
router.get('/items/check', async (req, res) => {
  const { StoreID, ProductID } = req.query;

  if (!StoreID || !ProductID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const results = await Item.findAll({
      attributes: ['Name', 'Price'],
      where: { Store_ID: StoreID, Product_ID: ProductID }
    });
    res.json(results);
  } catch (error) {
    console.error("Error checking item:", error);
    res.status(500).json({ error: 'Error checking item' });
  }
});

// Check current day item
router.get('/items/check_current_day', async (req, res) => {
  const { StoreID, ProductID } = req.query;

  if (!StoreID || !ProductID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const results = await Item.findAll({
      attributes: ['Name', 'Price'],
      where: {
        Store_ID: StoreID,
        Product_ID: ProductID,
        [db.Sequelize.Op.not]: db.Sequelize.fn('CURDATE')
      }
    });
    res.json(results);
  } catch (error) {
    console.error("Error checking item:", error);
    res.status(500).json({ error: 'Error checking item' });
  }
});

// Update item price
router.put('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const { StoreID, ProductID, Price } = req.body;

  if (!StoreID || !ProductID || !Price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.update({ Price, TS: db.Sequelize.fn('CURRENT_TIMESTAMP') });
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Error updating item' });
  }
});

module.exports = router;