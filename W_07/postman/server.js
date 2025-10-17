// server.js
const express = require('express');
const app = express();
const port = 3000;

// In-memory data store
let items = [
  { id: 1, name: 'Item1', price: 100 }, { id: 2, name: 'Item2', price: 200 }, { id: 3, name: 'Item3', price: 300 }
];

app.use(express.json());

// Routes for API
// GET - retrieve all items
app.get('/api/items', (req, res) => {
  console.log('GET /api/items called');
  res.status(200).json(items);
});

// GET - retrieve item by ID
app.get('/api/items/:id', (req, res) => {
  console.log(`GET /api/items/${req.params.id} called`);
  const { id } = req.params;
  const item = items.find(item => item.id === parseInt(id));
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// POST - Add new item
app.post('/api/items', (req, res) => {
  console.log('POST /api/items called');
  console.log('Request Body:', req.body);
  const newItem = req.body;
  newItem.id = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT - Update item by ID
app.put('/api/items/:id', (req, res) => {
  console.log(`PUT /api/items/${req.params.id} called`);
  console.log('Request Body:', req.body);
  const { id } = req.params;
  const updatedItem = req.body;
  const index = items.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem };
    res.status(200).json(items[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// DELETE - Delete item by ID
app.delete('/api/items/:id', (req, res) => {
  console.log(`DELETE /api/items/${req.params.id} called`);
  const { id } = req.params;
  const initialLength = items.length;
  items = items.filter(item => item.id !== parseInt(id));
  if (items.length < initialLength) {
    res.status(200).json({ message: 'Item deleted successfully' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});