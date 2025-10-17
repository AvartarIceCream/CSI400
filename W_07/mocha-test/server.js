// server.js
const express = require('express');
const app = express();
const port = 3000;

// ข้อมูลเริ่มต้น
let items = [
  { id: 1, name: 'Item1', price: 100 },
  { id: 2, name: 'Item2', price: 200 }
];

app.use(express.json());
app.use(express.static('public')); // ให้บริการไฟล์ static จากโฟลเดอร์ public

// Routes สำหรับ API
// GET - ดึงข้อมูลทั้งหมด
app.get('/api/items', (req, res) => {
  res.status(200).json(items);
});

// GET - ดึงข้อมูลโดย ID
app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(item => item.id === parseInt(id));
  
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// POST - สร้างข้อมูลใหม่
app.post('/api/items', (req, res) => {
  const newItem = req.body;
  newItem.id = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT - อัพเดทข้อมูล
app.put('/api/items/:id', (req, res) => {
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

// DELETE - ลบข้อมูล
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = items.length;
  items = items.filter(item => item.id !== parseInt(id));
  
  if (items.length < initialLength) {
    res.status(200).json({ message: 'Item deleted successfully' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Route หลักสำหรับหน้าเว็บ
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// เริ่มต้น server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Frontend available at http://localhost:${port}`);
});

module.exports = app; // สำหรับการทดสอบ