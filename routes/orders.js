const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const Orders = db.Orders; // Ensure the correct model name

router.post('/', async (req, res) => {
  const { User_ID, Total, Name } = req.body;

  if (!User_ID || !Total || !Name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const order = await Orders.create({ User_ID, Total, Name });
    console.log("Order added:", order.ID);
    res.json({ id: order.ID });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: 'Error adding order' });
  }
});

router.get('/display', async (req, res) => {
    const { User_ID } = req.query;
    
    if (!User_ID) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const results = await Orders.findAll({
        attributes: ['ID', 'Total', 'Name'],
        where: { User_ID }
        });
        
        res.json(results);
    } catch (error) {
        console.error("Error checking order:", error);
        res.status(500).json({ error: 'Error checking order' });
    }
});

router.delete('/delete', async (req, res) => {
    const { ID } = req.query;
    
    if (!ID) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const result = await Orders.destroy({
            where: { ID }
        });
        
        console.log("Result of delete operation:", result);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: 'Error deleting order' });
    }
});

router.put('/update', async (req, res) => {
    const { ID, Name } = req.body;
    
    if (!ID || !Name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const result = await Orders.update(
            { Name },
            { where: { ID } }
        );
        
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: 'Error updating order' });
    }
});
module.exports = router;