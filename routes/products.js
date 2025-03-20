const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the models

const Product = db.products;

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
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

// Create a new product
router.post('/products', async (req, res) => {
  const { name, description, price, quantity } = req.body;

  // Basic validation
  if (!name || !description || !price || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const product = await Product.create({ name, description, price, quantity });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, quantity } = req.body;

  // Basic validation
  if (!name || !description || !price || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update({ name, description, price, quantity });
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
