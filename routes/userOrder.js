const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const User_Order = db.User_Order; // Ensure the correct model name

// Add a new user order
router.post('/', async (req, res) => {
  const { Order_ID, items } = req.body; // Expecting an array of items

  console.log("Received request to add user orders:", { Order_ID, items });

  if (!Order_ID || !items || !Array.isArray(items) || items.length === 0) {
    console.error("Invalid request data:", { Order_ID, items });
    return res.status(400).json({ error: 'Missing required fields or items' });
  }

  try {
    const dataToInsert = items.map(item => ({
      Item_ID: item.Item_ID,
      Store_ID: item.Store_ID,
      Product_ID: item.Product_ID,
      Order_ID: Order_ID,
      Quantity: item.quantity, // Default to 1 if not provided
      Individual_Total: item.totalPrice, // Default to 0.0 if not provided
      Item_Name: item.Name,
      Store_Name: item.storeName
    }));

    console.log("Data to insert:", dataToInsert);

    const userOrders = await User_Order.bulkCreate(dataToInsert);

    console.log("User Orders added:", userOrders.map(order => order.ID));
    res.status(201).json({ message: 'User orders added successfully' });
  } catch (error) {
    console.error("Error adding user orders:", error);
    res.status(500).json({ error: 'Error adding user orders' });
  }
});

// In user_orders.js, update the GET /display route
router.get('/display', async (req, res) => {
  const { Order_ID } = req.query;

  if (!Order_ID) {
    console.error("Missing Order_ID in request:", req.query);
    return res.status(400).json({ error: 'Missing Order_ID' });
  }

  try {
    const results = await User_Order.findAll({
      attributes: ['Item_ID', 'Quantity', 'Individual_Total'], // Attributes from User_Order
      where: { Order_ID: Order_ID },
      include: [
        {
          model: db.Item, // Include the Item model
          attributes: ['Name'], // Retrieve the Item Name
          include: [
            {
              model: db.Store, // Include the Store model through Item
              attributes: ['Name'], // Retrieve the Store Name
            },
          ],
        },
      ],
    });

    if (results.length === 0) {
      console.log(`No items found for Order_ID: ${Order_ID}`);
      return res.status(404).json({ message: 'No items found for this order' });
    }

    console.log("User orders retrieved:", results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving order items:", error);
    res.status(500).json({ error: 'Error fetching items' });
  }
});

router.delete('/delete', async (req, res) => {
  const { Order_ID } = req.query;

  if (!Order_ID) {
    console.error("Missing Order_ID in request:", req.query);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try{
    const result = await User_Order.destroy({
      where: { Order_ID: Order_ID }
    });

    console.log("Result of delete operation:", result);
    res.status(200).json({ message: 'User order deleted successfully' });
  }
  catch (error) {
    console.error("Error deleting user order:", error);
    res.status(500).json({ error: 'Error deleting user order' });
  }
});


module.exports = router;

