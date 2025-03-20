const express = require('express');
const router = express.Router();
const productRoutes = require('./products'); // Import product routes

// Mount product routes
router.use('/', productRoutes);

module.exports = router;
