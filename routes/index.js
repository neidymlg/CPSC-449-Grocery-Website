const express = require('express');
const router = express.Router();
const productRoutes = require('./products'); // Import product routes
const storeRoutes = require('./stores'); // Import store routes
const userRoutes = require('./users'); // Import user routes

router.use('/', productRoutes);
router.use('/', storeRoutes);
router.use('/', userRoutes);

module.exports = router;
