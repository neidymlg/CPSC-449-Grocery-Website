const express = require('express');
const router = express.Router();
const productRoutes = require('./products'); // Import product routes
const storeRoutes = require('./stores'); // Import store routes
const itemRoutes = require('./item'); // Import item routes
const userRoutes = require('./users'); // Import user routes
const userLocationRoutes = require('./user_location'); // Import user location routes
const userOrderRoutes = require('./user_orders'); // Import user order routes

// router.use('/', productRoutes);
// router.use('/', storeRoutes);
// router.use('/', userRoutes);
router.use('/', itemRoutes);
// router.use('/', userLocationRoutes);
// router.use('/', userOrderRoutes);

module.exports = router;
