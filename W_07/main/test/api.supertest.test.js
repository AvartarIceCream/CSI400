const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app'); // สมมติ export Express app (not listening)
describe('Users API (supertest)', function () {
    let createdId;
    it('POST /users', async function () {
        const res = await request(app)
            .post('/users')
            .send({ name: 'Test', email: `a${Date.now()}@ex.com` })
            .expect(201);
        expect(res.body).to.have.property('id');
        createdId = res.body.id;
    });
    it('GET /users/:id', async function () {
        const res = await request(app).get(`/users/${createdId}`).expect(200);
        expect(res.body).to.have.property('id', createdId);
    });
    after(async function () {
        await request(app).delete(`/users/${createdId}`).expect(200);
    });
}); 