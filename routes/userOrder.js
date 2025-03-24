const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const User_Order = db.User_Order; // Ensure the correct model name

// Add a new user order
router.post('/user_orders', async (req, res) => {
  const { Item_ID, Store_ID, Product_ID, Order_ID } = req.body;

  if (!Item_ID || !Store_ID || !Product_ID || !Order_ID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userOrder = await User_Order.create({ Item_ID, Store_ID, Product_ID, Order_ID });
    console.log("User Order added:", userOrder.ID);
    res.status(201).json({ id: userOrder.ID });
  } catch (error) {
    console.error("Error adding user order:", error);
    res.status(500).json({ error: 'Error adding user order' });
  }
});

module.exports = router;