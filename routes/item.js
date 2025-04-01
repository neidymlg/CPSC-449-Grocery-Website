const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const Item = db.Item; // Ensure the correct model name

// Add a new item
router.post('/', async (req, res) => {
  const { StoreID, ProductID, Name, Price } = req.body;

  if (!StoreID || !ProductID || !Name || !Price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const item = await Item.create({ Store_ID: StoreID, Product_ID: ProductID, Name: Name, Price: Price });
    console.log("Store item added:", item.ID);
    res.json({ id: item.ID });
  } catch (error) {
    console.error("Error adding store item:", error);
    res.status(500).json({ error: 'Error adding store item' });
  }
});

// Check item
router.get('/display', async (req, res) => {
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
router.get('/check_current_day', async (req, res) => {
  const { StoreID, ProductID } = req.query;

  if (!StoreID || !ProductID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const results = await Item.findAll({
      attributes: ['ID'],
      where: {
        Store_ID: StoreID,
        Product_ID: ProductID,
        [db.Sequelize.Op.not]: db.Sequelize.fn('CURDATE')
      }
    });
    const formattedItems = results.map(result => ({
      id: result.ID
    }));
    res.json(formattedItems);
  } catch (error) {
    console.error("Error checking item:", error);
    res.status(500).json({ error: 'Error checking item' });
  }
});

// Check if a store has no items
router.get('/check_no_items', async (req, res) => {
  const { StoreID, ProductID } = req.query;

  if (!StoreID || !ProductID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Count the number of items for the given StoreID and ProductID
    const itemCount = await Item.count({
      where: {
        Store_ID: StoreID,
        Product_ID: ProductID,
      },
    });

    // If itemCount is 0, the store has no items
    const hasNoItems = itemCount === 0;
    res.json({ hasNoItems });
  } catch (error) {
    console.error("Error checking if store has no items:", error);
    res.status(500).json({ error: 'Error checking if store has no items' });
  }
});

// Update item price
router.put('/:id', async (req, res) => {
  const itemId = req.params.id;
  const { StoreID, ProductID, Price } = req.body;

  if (!StoreID || !ProductID || !Price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find the item by ID, StoreID, and ProductID
    const item = await Item.findOne({
      where: {
        ID: itemId,
        Store_ID: StoreID,
        Product_ID: ProductID,
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update the item's price and timestamp
    await item.update({ Price, TS: db.Sequelize.fn('CURRENT_TIMESTAMP') });
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Error updating item' });
  }
});

module.exports = router;