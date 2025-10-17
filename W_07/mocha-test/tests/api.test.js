// tests/api.test.js
const request = require('supertest');
const app = require('../server'); // Import app จาก server.js

describe('Items API Tests', function() {
  // ตั้ง timeout ให้ยาวพอ
  this.timeout(5000);

  let testItemId;

  // ===== TEST 1: GET ALL ITEMS =====
  describe('GET /api/items', function() {
    it('should return all items with status 200', function(done) {
      request(app)
        .get('/api/items')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          // ตรวจสอบว่า response เป็น array
          if (!Array.isArray(res.body)) {
            throw new Error('Response should be an array');
          }
          // ตรวจสอบว่ามีข้อมูลเริ่มต้น
          if (res.body.length < 2) {
            throw new Error('Should have at least 2 initial items');
          }
        })
        .end(done);
    });
  });

  // ===== TEST 2: GET ITEM BY ID =====
  describe('GET /api/items/:id', function() {
    it('should return item by ID', function(done) {
      request(app)
        .get('/api/items/1')
        .expect(200)
        .expect(function(res) {
          if (res.body.id !== 1) throw new Error('Wrong item ID');
          if (res.body.name !== 'Item1') throw new Error('Wrong item name');
          if (res.body.price !== 100) throw new Error('Wrong item price');
        })
        .end(done);
    });

    it('should return 404 for non-existent item', function(done) {
      request(app)
        .get('/api/items/999')
        .expect(404)
        .expect(function(res) {
          if (!res.body.error) throw new Error('Should have error message');
        })
        .end(done);
    });
  });

  // ===== TEST 3: CREATE NEW ITEM =====
  describe('POST /api/items', function() {
    it('should create a new item', function(done) {
      const newItem = {
        name: 'Test Item',
        price: 350
      };

      request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          // ตรวจสอบโครงสร้างข้อมูล
          if (!res.body.id) throw new Error('Missing ID');
          if (res.body.name !== newItem.name) throw new Error('Wrong name');
          if (res.body.price !== newItem.price) throw new Error('Wrong price');
          
          // บันทึก ID สำหรับ test ต่อไป
          testItemId = res.body.id;
          console.log('✅ Created item with ID:', testItemId);
        })
        .end(done);
    });
  });

  // ===== TEST 4: UPDATE ITEM =====
  describe('PUT /api/items/:id', function() {
    it('should update an existing item', function(done) {
      const updatedData = {
        name: 'Updated Test Item',
        price: 999
      };

      request(app)
        .put(`/api/items/${testItemId}`)
        .send(updatedData)
        .expect(200)
        .expect(function(res) {
          if (res.body.name !== updatedData.name) throw new Error('Name not updated');
          if (res.body.price !== updatedData.price) throw new Error('Price not updated');
          if (res.body.id !== testItemId) throw new Error('ID should not change');
        })
        .end(done);
    });

    it('should return 404 for non-existent item', function(done) {
      request(app)
        .put('/api/items/9999')
        .send({ name: 'Test' })
        .expect(404)
        .end(done);
    });
  });

  // ===== TEST 5: DELETE ITEM =====
  describe('DELETE /api/items/:id', function() {
    it('should delete an item', function(done) {
      request(app)
        .delete(`/api/items/${testItemId}`)
        .expect(200)
        .expect(function(res) {
          if (res.body.message !== 'Item deleted successfully') {
            throw new Error('Wrong success message');
          }
        })
        .end(done);
    });

    it('should verify item is deleted', function(done) {
      request(app)
        .get(`/api/items/${testItemId}`)
        .expect(404) // ควรได้ 404 เพราะลบไปแล้ว
        .end(done);
    });
  });
});