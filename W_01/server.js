// เรียกใช้ Express framework
const express = require('express');

// สร้าง object app จาก express เพื่อใช้สร้าง web server
const app = express();

// กำหนด port ที่ server จะรัน (ตรงนี้คือ 3000)
const port = 3000;

// สร้าง route หลัก (GET /) ถ้ามีการเรียก URL root
// จะส่งข้อความ "Hello, Web Services!" กลับไป
app.get('/', (req, res) => {
  res.send('Hello, Web Services!');
});

// Middleware สำหรับจัดการกรณีไม่พบเส้นทาง (404 Not Found)
// ถ้าไม่มี route ไหน match จะมาตรงนี้ แล้วส่ง JSON error กลับไป
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// สั่งให้ server เริ่มทำงานที่ port ที่กำหนด
// และแสดง log บอกว่า server รันแล้ว
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
