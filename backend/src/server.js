// ─────────────────────────────────────────────────────────────────
//  server.js — Entry point, starts the HTTP server
// ─────────────────────────────────────────────────────────────────
const { createApp } = require('./app');

const PORT = process.env.PORT || 5000;
const app  = createApp();

app.listen(PORT, () => {
  console.log(`✅ Task Manager API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Tasks:  http://localhost:${PORT}/api/tasks`);
});
