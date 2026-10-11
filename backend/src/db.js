// ─────────────────────────────────────────────────────────────────
//  db.js — SQLite via sql.js (pure JS, no native build tools needed)
// ─────────────────────────────────────────────────────────────────
const initSqlJs = require('sql.js');
const fs        = require('fs');
const path      = require('path');

const DB_PATH   = process.env.DB_PATH || path.join(__dirname, '..', 'tasks.db');
const IN_MEMORY = DB_PATH === ':memory:';

let db  = null;
let SQL = null;

async function getDb() {
  if (db) return db;
  SQL = await initSqlJs();
  if (!IN_MEMORY && fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT    DEFAULT '',
      priority    TEXT    DEFAULT 'medium',
      status      TEXT    DEFAULT 'pending',
      category    TEXT    DEFAULT 'general',
      due_date    TEXT    DEFAULT NULL,
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now'))
    )
  `);
  return db;
}

function save() {
  if (IN_MEMORY || !db) return;
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function queryOne(db, sql, params = []) {
  return queryAll(db, sql, params)[0] || null;
}

function execute(db, sql, params = []) {
  db.run(sql, params);
  save();
  return db.exec('SELECT last_insert_rowid() as id')[0]?.values[0][0];
}

function closeDb() {
  if (db) { db.close(); db = null; }
}

module.exports = { getDb, closeDb, queryAll, queryOne, execute };
