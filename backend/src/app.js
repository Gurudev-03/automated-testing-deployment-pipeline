// ─────────────────────────────────────────────────────────────────
//  app.js — Express app factory (separated for testability)
// ─────────────────────────────────────────────────────────────────
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const tasksRouter  = require('./routes/tasks');
const { notFound, errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  // ── Security & parsing middleware ───────────────────────────────
  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // ── Logging (skip in test) ──────────────────────────────────────
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  // ── Health check ────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── API routes ──────────────────────────────────────────────────
  app.use('/api/tasks', tasksRouter);

  // ── Error handlers ──────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
