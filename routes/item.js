const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const Item = db.Item; // Ensure the correct model name

// Add a new item
router.post('/', async (req, res) => {
  const { StoreID, ProductID, Name, Price } = req.body;

  if (!StoreID || !ProductID || !Name || Price === null || Price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const truncatedName = Name.length > 200 ? Name.substring(0, 199) : Name;

  try {
    const existingItem = await Item.findOne({
      where: {
        Store_ID: StoreID,
        Product_ID: ProductID,
        Name: truncatedName
      },
    });
  
    if (existingItem) {
      console.log(`Duplicate item skipped: StoreID=${StoreID}, ProductID=${ProductID}`);
      return res.status(200).json({ message: 'Item already exists', id: existingItem.ID });
    }

    const item = await Item.create({ Store_ID: StoreID, Product_ID: ProductID, Name: truncatedName, Price: Price });
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
      attributes: ['Store_ID'], // Select only Store_ID
      where: {
        Store_ID: {
          [db.Sequelize.Op.in]: storeIdArray, // Filter by StoreIDs array
        },
        Product_ID: ProductID, // Match the given ProductID
      },
      group: ['Store_ID'], // Group by Store_ID
      having: db.Sequelize.literal('COUNT(*) > 0'), // Only include stores with items
    });

    // Extract Store_IDs from the result
    const storesWithItemsIds = storesWithItems.map(store => store.Store_ID);


    const emptyStores = await Item.findAll({
      attributes: ['Store_ID'], // Select only Store_ID
      where: {
        Store_ID: {
          [db.Sequelize.Op.in]: storeIdArray, // Filter by StoreIDs array
          [db.Sequelize.Op.notIn]: storesWithItemsIds, // Exclude stores with items
        },
      },
      group: ['Store_ID'], // Group by Store_ID
    });

    // Extract Store_IDs from the result
    const emptyStoreIDs = emptyStores.map(store => store.Store_ID);
    
    res.json({ emptyStoreIDs });
  } catch (error) {
    console.error("Error checking empty stores:", error);
    res.status(500).json({ error: 'Error checking empty stores' });
  }
});

// Update item price
router.put('/', async (req, res) => {
  const {ID, StoreID, ProductID, Price } = req.body;

  if (!StoreID || !ProductID || !Price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find the item by ID, StoreID, and ProductID
    const item = await Item.findOne({
      where: {
        ID: ID,
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