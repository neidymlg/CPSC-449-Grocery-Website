const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const Store = db.Store;

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Error fetching stores' });
  }
});

router.get('/getname', async (req, res) => {
  const { storeId } = req.query;
  try {
    const store = await Store.findByPk(storeId, {
      attributes: ['Name'] // Only select the location attribute
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json({ Name: store.Name });
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Error fetching store' });
  }
});

// Check store location
router.get('/check', async (req, res) => {
  const { LONG, LAT } = req.query;

  if (!LONG || !LAT) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const results = await Store.findAll({
      attributes: ['ID', 'Name'],
      where: db.Sequelize.where(
        db.Sequelize.fn(
          'ST_Distance_Sphere',
          db.Sequelize.col('geom_loc'),
          db.Sequelize.fn('POINT', LONG, LAT)
        ),
        '<',
        16093 //10 miles as meters
      ),
      order: [
        [
          db.Sequelize.fn(
            'ST_Distance_Sphere',
            db.Sequelize.col('geom_loc'),
            db.Sequelize.fn('POINT', LONG, LAT)
          ),
          'ASC',
        ],
      ],
    });
    const storeIDs = results.map(store => store.ID);
    res.json(storeIDs);
  } catch (error) {
    console.error("Error checking location:", error);
    res.status(500).json({ error: 'Error checking location' });
  }
});

// Get store by ID
router.get('/:id', async (req, res) => {
  const storeId = req.params.id;
  try {
    const store = await Store.findByPk(storeId, {
      attributes: ['geom_loc'] // Only select the location attribute
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Extract latitude and longitude from the Point geometry
    const [longitude, latitude] = store.geom_loc.coordinates;

    res.json({ latitude, longitude });
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Error fetching store' });
  }
});

// Add a new store
router.post('/', async (req, res) => {
  const { storeID, LONG, LAT, Name } = req.body;

  if (!LONG || !LAT || !Name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingStore = await Store.findOne({ where: { ID: storeID } });
    if (existingStore) {
      console.log(`Duplicate store skipped: ${storeID}`);
      return res.status(200).json({ message: 'Store already exists', id: existingStore.ID });
    }

    const store = await Store.create({
      ID: storeID,
      geom_loc: db.Sequelize.fn('ST_GeomFromText', `POINT(${LONG} ${LAT})`),
      Name,
    });    
    console.log("Store added:", store.ID);
    res.status(201).json({ id: store.ID });
  } catch (error) {
    console.error("Error adding store:", error);
    res.status(500).json({ error: 'Error adding store' });
  }
});



// Update a store
router.put('/', async (req, res) => {
  const { storeId, name, lat, long } = req.body;

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
    res.status(500).json({ error: 'Error updating store' });
  }
});

// Delete a store
router.delete('/:id', async (req, res) => {
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