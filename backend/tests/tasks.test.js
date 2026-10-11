// ─────────────────────────────────────────────────────────────────
//  tasks.test.js — Full integration tests for the Tasks REST API
//  Uses an in-memory SQLite DB per test run (DB_PATH=:memory:)
// ─────────────────────────────────────────────────────────────────
process.env.NODE_ENV = 'test';
process.env.DB_PATH  = ':memory:';

const request = require('supertest');
const { createApp } = require('../src/app');
const { closeDb }   = require('../src/db');

const app = createApp();
afterAll(() => closeDb());

// ── Health ─────────────────────────────────────────────────────────
describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ── 404 ─────────────────────────────────────────────────────────────
describe('Unknown routes', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── Stats ────────────────────────────────────────────────────────────
describe('GET /api/tasks/stats', () => {
  it('returns stats object', async () => {
    const res = await request(app).get('/api/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('pending');
    expect(res.body.data).toHaveProperty('inProgress');
    expect(res.body.data).toHaveProperty('completed');
    expect(res.body.data).toHaveProperty('high');
    expect(res.body.data).toHaveProperty('overdue');
  });
  it('reflects accurate counts', async () => {
    await request(app).post('/api/tasks').send({ title: 'Stats Task', priority: 'high', status: 'completed' });
    const res = await request(app).get('/api/tasks/stats');
    expect(res.body.data.total).toBeGreaterThan(0);
    expect(res.body.data.completed).toBeGreaterThan(0);
  });
});

// ── GET /api/tasks ───────────────────────────────────────────────────
describe('GET /api/tasks', () => {
  it('returns array with count', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe('number');
  });
  it('filters by status', async () => {
    await request(app).post('/api/tasks').send({ title: 'Filter Task', status: 'completed' });
    const res = await request(app).get('/api/tasks?status=completed');
    res.body.data.forEach(t => expect(t.status).toBe('completed'));
  });
  it('filters by priority', async () => {
    await request(app).post('/api/tasks').send({ title: 'High Task', priority: 'high' });
    const res = await request(app).get('/api/tasks?priority=high');
    res.body.data.forEach(t => expect(t.priority).toBe('high'));
  });
  it('filters by category', async () => {
    await request(app).post('/api/tasks').send({ title: 'College Task', category: 'college' });
    const res = await request(app).get('/api/tasks?category=college');
    res.body.data.forEach(t => expect(t.category).toBe('college'));
  });
});

// ── POST /api/tasks ──────────────────────────────────────────────────
describe('POST /api/tasks', () => {
  it('creates task with defaults', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'New Task' });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('New Task');
    expect(res.body.data.priority).toBe('medium');
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data.category).toBe('general');
  });
  it('creates task with all fields', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Full Task', description: 'Details', priority: 'high',
      status: 'in-progress', category: 'work', due_date: '2030-12-31',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.category).toBe('work');
    expect(res.body.data.due_date).toBe('2030-12-31');
  });
  it('returns 400 when title missing', async () => {
    const res = await request(app).post('/api/tasks').send({ priority: 'low' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
  it('returns 400 for invalid priority', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'T', priority: 'urgent' });
    expect(res.status).toBe(400);
  });
  it('returns 400 for invalid status', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'T', status: 'done' });
    expect(res.status).toBe(400);
  });
  it('returns 400 for invalid category', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'T', category: 'unknown' });
    expect(res.status).toBe(400);
  });
  it('returns 400 for title over 200 chars', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'x'.repeat(201) });
    expect(res.status).toBe(400);
  });
});

// ── GET /api/tasks/:id ───────────────────────────────────────────────
describe('GET /api/tasks/:id', () => {
  it('returns single task', async () => {
    const { body: { data: created } } = await request(app).post('/api/tasks').send({ title: 'Single' });
    const res = await request(app).get(`/api/tasks/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Single');
  });
  it('returns 404 for missing task', async () => {
    const res = await request(app).get('/api/tasks/99999');
    expect(res.status).toBe(404);
  });
});

// ── PUT /api/tasks/:id ───────────────────────────────────────────────
describe('PUT /api/tasks/:id', () => {
  it('updates all fields', async () => {
    const { body: { data: t } } = await request(app).post('/api/tasks').send({ title: 'Old' });
    const res = await request(app).put(`/api/tasks/${t.id}`).send({
      title: 'New', description: 'Updated', priority: 'low',
      status: 'completed', category: 'personal',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('New');
    expect(res.body.data.category).toBe('personal');
  });
  it('returns 404 for missing task', async () => {
    const res = await request(app).put('/api/tasks/99999').send({ title: 'X' });
    expect(res.status).toBe(404);
  });
});

// ── PATCH /api/tasks/:id/status ──────────────────────────────────────
describe('PATCH /api/tasks/:id/status', () => {
  it('updates status', async () => {
    const { body: { data: t } } = await request(app).post('/api/tasks').send({ title: 'Status' });
    const res = await request(app).patch(`/api/tasks/${t.id}/status`).send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });
  it('returns 400 for invalid status', async () => {
    const { body: { data: t } } = await request(app).post('/api/tasks').send({ title: 'X' });
    const res = await request(app).patch(`/api/tasks/${t.id}/status`).send({ status: 'invalid' });
    expect(res.status).toBe(400);
  });
});

// ── DELETE /api/tasks/:id ────────────────────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  it('deletes a task', async () => {
    const { body: { data: t } } = await request(app).post('/api/tasks').send({ title: 'Delete Me' });
    const del = await request(app).delete(`/api/tasks/${t.id}`);
    expect(del.status).toBe(200);
    const get = await request(app).get(`/api/tasks/${t.id}`);
    expect(get.status).toBe(404);
  });
  it('returns 404 for missing task', async () => {
    expect((await request(app).delete('/api/tasks/99999')).status).toBe(404);
  });
});

// ── DELETE /api/tasks (bulk) ─────────────────────────────────────────
describe('DELETE /api/tasks (clear completed)', () => {
  it('removes all completed tasks', async () => {
    await request(app).post('/api/tasks').send({ title: 'Done 1', status: 'completed' });
    await request(app).post('/api/tasks').send({ title: 'Done 2', status: 'completed' });
    const res = await request(app).delete('/api/tasks');
    expect(res.status).toBe(200);
    const remaining = await request(app).get('/api/tasks?status=completed');
    expect(remaining.body.data.length).toBe(0);
  });
});
