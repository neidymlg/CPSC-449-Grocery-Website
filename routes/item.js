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
  const { StoreIDs, ProductID } = req.query;

  if (!StoreIDs || !ProductID) {
    console.error("Missing required fields:", { StoreIDs, ProductID });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const storeIdArray = StoreIDs.split(',');

  try {
    const results = await Item.findAll({
      attributes: ['ID', 'Store_ID'],
      where: {
        Store_ID: {
          [db.Sequelize.Op.in]: storeIdArray
        },
        Product_ID: ProductID,
        TS: { 
          [db.Sequelize.Op.ne]: db.Sequelize.fn('CURDATE') 
        }
      }
    });
    
    res.json(results);
  } catch (error) {
    console.error("Error checking item:", error);
    res.status(500).json({ error: 'Error checking item' });
  }
});


// Check if a store has no items
router.get('/check_no_items', async (req, res) => {
  const { StoreIDs, ProductID } = req.query;

  if (!StoreIDs || !ProductID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const storeIdArray = StoreIDs.split(',');
    
    // Find stores with ANY items
    const storesWithItems = await Item.findAll({
      attributes: ['ID'],
      where: {
        ID: {
          [db.Sequelize.Op.in]: storeIdArray,
          [db.Sequelize.Op.notIn]: db.Sequelize.literal(`(
            SELECT Store_ID FROM Item WHERE Product_ID = ${ProductID}
          )`)
        }
      }
    });

    const emptyStoreIDs = storesWithItems.map(store => store.ID);

    res.json({ emptyStoreIDs });
  } catch (error) {
    console.error("Error checking empty stores:", error);
    res.status(500).json({ error: 'Error checking empty stores' });
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
    await item.update({ Price, TS: db.Sequelize.fn('CURRENT_DATE') });
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Error updating item' });
  }
});

module.exports = router;