// ─────────────────────────────────────────────────────────────────
//  errorHandler.js — Global error handling middleware
// ─────────────────────────────────────────────────────────────────

function notFound(req, res, next) {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
}

function errorHandler(err, req, res, _next) {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error:   err.message || 'Internal server error'
  });
}

module.exports = { notFound, errorHandler };
