// ─────────────────────────────────────────────────────────────────
//  routes/tasks.js — Full CRUD + stats for tasks
// ─────────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const { getDb, queryAll, queryOne, execute } = require('../db');

const PRIORITIES = ['low','medium','high'];
const STATUSES   = ['pending','in-progress','completed'];
const CATEGORIES = ['general','work','personal','college','bug','feature'];

function validateTask(body) {
  const errors = [];
  if (!body.title || typeof body.title !== 'string' || !body.title.trim())
    errors.push('Title is required');
  if (body.title && body.title.trim().length > 200)
    errors.push('Title must be 200 characters or less');
  if (body.priority && !PRIORITIES.includes(body.priority))
    errors.push('Priority must be low, medium, or high');
  if (body.status && !STATUSES.includes(body.status))
    errors.push('Status must be pending, in-progress, or completed');
  if (body.category && !CATEGORIES.includes(body.category))
    errors.push(`Category must be one of: ${CATEGORIES.join(', ')}`);
  if (body.due_date && isNaN(Date.parse(body.due_date)))
    errors.push('due_date must be a valid date string');
  return errors;
}

// GET /api/tasks/stats
router.get('/stats', async (req, res) => {
  try {
    const db    = await getDb();
    const all   = queryAll(db, 'SELECT * FROM tasks');
    const now   = new Date().toISOString();
    const stats = {
      total:      all.length,
      pending:    all.filter(t => t.status === 'pending').length,
      inProgress: all.filter(t => t.status === 'in-progress').length,
      completed:  all.filter(t => t.status === 'completed').length,
      high:       all.filter(t => t.priority === 'high').length,
      overdue:    all.filter(t => t.due_date && t.due_date < now && t.status !== 'completed').length,
    };
    res.json({ success: true, data: stats });
  } catch { res.status(500).json({ success: false, error: 'Failed to fetch stats' }); }
});

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const { status, priority, category } = req.query;
    let sql = 'SELECT * FROM tasks', params = [], where = [];
    if (status)   { where.push('status = ?');   params.push(status); }
    if (priority) { where.push('priority = ?'); params.push(priority); }
    if (category) { where.push('category = ?'); params.push(category); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY CASE priority WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 ELSE 3 END, id DESC';
    const tasks = queryAll(db, sql, params);
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch { res.status(500).json({ success: false, error: 'Failed to fetch tasks' }); }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const db   = await getDb();
    const task = queryOne(db, 'SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch { res.status(500).json({ success: false, error: 'Failed to fetch task' }); }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const errors = validateTask(req.body);
    if (errors.length) return res.status(400).json({ success: false, errors });
    const { title, description = '', priority = 'medium', status = 'pending', category = 'general', due_date = null } = req.body;
    const db = await getDb();
    const id = execute(db,
      'INSERT INTO tasks (title, description, priority, status, category, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [title.trim(), description.trim(), priority, status, category, due_date]
    );
    res.status(201).json({ success: true, data: queryOne(db, 'SELECT * FROM tasks WHERE id = ?', [id]) });
  } catch { res.status(500).json({ success: false, error: 'Failed to create task' }); }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const db   = await getDb();
    const task = queryOne(db, 'SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    const errors = validateTask({ ...task, ...req.body });
    if (errors.length) return res.status(400).json({ success: false, errors });
    const { title = task.title, description = task.description, priority = task.priority,
            status = task.status, category = task.category, due_date = task.due_date } = req.body;
    execute(db,
      `UPDATE tasks SET title=?,description=?,priority=?,status=?,category=?,due_date=?,updated_at=datetime('now') WHERE id=?`,
      [title.trim(), description.trim(), priority, status, category, due_date, req.params.id]
    );
    res.json({ success: true, data: queryOne(db, 'SELECT * FROM tasks WHERE id = ?', [req.params.id]) });
  } catch { res.status(500).json({ success: false, error: 'Failed to update task' }); }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status))
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    const db   = await getDb();
    const task = queryOne(db, 'SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    execute(db, `UPDATE tasks SET status=?,updated_at=datetime('now') WHERE id=?`, [status, req.params.id]);
    res.json({ success: true, data: queryOne(db, 'SELECT * FROM tasks WHERE id = ?', [req.params.id]) });
  } catch { res.status(500).json({ success: false, error: 'Failed to update status' }); }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const db   = await getDb();
    const task = queryOne(db, 'SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    execute(db, 'DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch { res.status(500).json({ success: false, error: 'Failed to delete task' }); }
});

// DELETE /api/tasks (bulk delete completed)
router.delete('/', async (req, res) => {
  try {
    const db = await getDb();
    execute(db, "DELETE FROM tasks WHERE status = 'completed'", []);
    res.json({ success: true, message: 'Completed tasks cleared' });
  } catch { res.status(500).json({ success: false, error: 'Failed to clear tasks' }); }
});

module.exports = router;
