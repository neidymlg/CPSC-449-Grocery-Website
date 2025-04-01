const express = require('express');
const router = express.Router();
const productRoutes = require('./products'); // Import product routes
const storeRoutes = require('./stores'); // Import store routes
const itemRoutes = require('./item');
const userRoutes = require('./users'); // Import user routes

router.use('/api/products', productRoutes);
router.use('/api/store', storeRoutes);
router.use('/api/item', itemRoutes);
router.use('/user', userRoutes);

module.exports = router;
