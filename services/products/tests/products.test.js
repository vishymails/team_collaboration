const request = require('supertest');

let app;

beforeEach(() => {
  jest.resetModules();
  app = require('../app');
});

describe('GET /health', () => {
  it('returns service status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ service: 'products', status: 'ok' });
  });
});

describe('GET /products', () => {
  it('returns seeded products', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });
});

describe('GET /products/:id', () => {
  it('returns a product by id', async () => {
    const res = await request(app).get('/products/1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.name).toBe('Laptop');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/products/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /products', () => {
  it('creates a product and returns 201', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Keyboard', price: 49.99, stock: 20 });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ name: 'Keyboard', price: 49.99, stock: 20 });
    expect(typeof res.body.data.id).toBe('number');
  });

  it('defaults stock to 0 when omitted', async () => {
    const res = await request(app).post('/products').send({ name: 'Monitor', price: 299.99 });
    expect(res.status).toBe(201);
    expect(res.body.data.stock).toBe(0);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/products').send({ price: 10 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when price is missing', async () => {
    const res = await request(app).post('/products').send({ name: 'Widget' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /products/:id', () => {
  it('deletes an existing product', async () => {
    const res = await request(app).delete('/products/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await request(app).get('/products/1');
    expect(check.status).toBe(404);
  });

  it('returns 404 when deleting unknown id', async () => {
    const res = await request(app).delete('/products/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
