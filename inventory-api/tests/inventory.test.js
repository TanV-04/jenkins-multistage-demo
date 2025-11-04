const request = require('supertest');
const app = require('../app');

describe('Inventory API', () => {
  it('GET /api/inventory returns array', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/inventory creates item', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({ name: 'orange', qty: 7 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('orange');
  });

  it('POST missing data should return 400', async () => {
    const res = await request(app).post('/api/inventory').send({ name: 'bad' });
    expect(res.statusCode).toBe(400);
  });
});
