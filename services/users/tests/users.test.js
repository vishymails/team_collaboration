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
    expect(res.body).toEqual({ service: 'users', status: 'ok' });
  });
});

describe('GET /users', () => {
  it('returns seeded users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });
});

describe('GET /users/:id', () => {
  it('returns a user by id', async () => {
    const res = await request(app).get('/users/1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.name).toBe('Alice');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/users/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /users', () => {
  it('creates a new user and returns 201', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Charlie', email: 'charlie@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ name: 'Charlie', email: 'charlie@example.com' });
    expect(typeof res.body.data.id).toBe('number');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/users').send({ email: 'x@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/users').send({ name: 'Charlie' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('PUT /users/:id', () => {
  it('updates name and email of an existing user', async () => {
    const res = await request(app)
      .put('/users/1')
      .send({ name: 'Alice Updated', email: 'alice.updated@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Alice Updated');
    expect(res.body.data.email).toBe('alice.updated@example.com');
  });

  it('updates only name when email is omitted', async () => {
    const res = await request(app).put('/users/2').send({ name: 'Bob Renamed' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Bob Renamed');
    expect(res.body.data.email).toBe('bob@example.com');
  });

  it('updates only email when name is omitted', async () => {
    const res = await request(app).put('/users/1').send({ email: 'new@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('new@example.com');
    expect(res.body.data.name).toBe('Alice');
  });

  it('returns 400 when no fields are provided', async () => {
    const res = await request(app).put('/users/1').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).put('/users/999').send({ name: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /users/:id', () => {
  it('deletes an existing user', async () => {
    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await request(app).get('/users/1');
    expect(check.status).toBe(404);
  });

  it('returns 404 when deleting unknown id', async () => {
    const res = await request(app).delete('/users/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
