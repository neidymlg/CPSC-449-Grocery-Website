const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const Product = db.Products; // Ensure the correct model name

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    console.log("Fetched products from DB:", products); // Debugging log
    const formattedProducts = products.map(product => ({
      id: product.ID,
      name: product.Name
    }));
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Check if a product exists
router.get('/products/check', async (req, res) => {
  const { name } = req.query;

  try {
    const product = await Product.findOne({ where: { Name: name } });
    if (product) {
      res.json({ id: product.ID });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error("Error checking product:", error);
    res.status(500).json({ error: 'Error checking product' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const product = await Product.create({ Name: name });
    console.log("Product added:", product.ID);
    res.status(201).json({ id: product.ID });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { name } = req.body;

  // Basic validation
  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  name = name.toLowerCase();

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update({ Name: name });
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;