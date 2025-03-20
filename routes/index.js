const express = require('express');
const router = express.Router();
const productRoutes = require('./products'); // Import product routes
const storeRoutes = require('./stores'); // Import store routes

router.use('/', productRoutes);
router.use('/', storeRoutes);

module.exports = router;
