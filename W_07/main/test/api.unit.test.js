const axios = require('axios');
const { expect } = require('chai');
const BASE = process.env.BASE_URL || "http://localhost:3000";
describe('Users API (axios)', function () {
    this.timeout(10000);
    let createdUserId;
    let token;
    before(async function () {
        // สมมติตอ้ง login ก่อน
        const res = await axios.post(`${BASE}/login`, { username: 'alice', password: 'password123' });
        expect(res.status).to.equal(200);
        token = res.data.token;
    });
    it('GET /users should return array', async function () {
        const res = await axios.get(`${BASE}/users`, { headers: { Authorization: `Bearer ${token}` } });
        expect(res.status).to.equal(200);
        expect(res.data).to.be.an('array');
    });
    it('POST /users should create user', async function () {
        const payload = { name: `Test-${Date.now()}`, email: `test${Date.now()}@example.com` };
        const res = await axios.post(`${BASE}/users`, payload, { headers: { Authorization: `Bearer ${token}` } });
        expect(res.status).to.equal(201);
        expect(res.data).to.have.property('id');
        createdUserId = res.data.id;
    });
    it('PUT /users/:id should update user', async function () {
        const res = await axios.put(`${BASE}/users/${createdUserId}`, { name: 'Updated' }, {
            headers: {
                Authorization: `Bearer${token}`
            }
        });
        expect(res.status).to.equal(200);
        expect(res.data).to.have.property('name', 'Updated');
    });
    it('DELETE /users/:id should delete user', async function () {
        const res = await axios.delete(`${BASE}/users/${createdUserId}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(res.status).to.be.oneOf([200, 204]);
    });
}); 