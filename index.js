// https://hectorcorrea.com/blog/2013-01-15/introduction-to-node-js
//keep in this file so it runs with the localhost/when website first starts
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
import { startPool, testConnection, closePool, addProduct } from './Grocery_db.js';
const app = express();
const port = 3000;

app.use(express.static(path.join(_dirname, 'client')));
app.use(express.json());

app.post('/api/addProduct', async (req, res) => {
  const connection = await startPool();
  const pname = req.body.pname; 
  const id = await addProduct(connection, pname);
  console.log("Product ID:", id);
  await closePool(connection);
  res.sendStatus(200);
});

//test connection to database
app.get('/api/ids', async(req, res) => {
  const connection = await startPool();
  const ids = await testConnection(connection);
  await closePool(connection);
  res.json(ids);
});

app.get('/api/info', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

