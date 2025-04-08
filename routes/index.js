const express = require('express');
const router = express.Router();
const productRoutes = require('./products'); // Import product routes
const storeRoutes = require('./stores'); // Import store routes
const itemRoutes = require('./item'); // Import item routes
const userRoutes = require('./users'); // Import user routes
const userOrderRoutes = require('./userOrder'); // Import user order routes
const orderRoutes = require('./orders'); // Import order routes

router.use('/api/products', productRoutes);
router.use('/api/store', storeRoutes);
router.use('/api/item', itemRoutes);
//router.use('/user', userRoutes);
router.use('/api/user_order', userOrderRoutes);
router.use('/api/orders', orderRoutes);

module.exports = router;
