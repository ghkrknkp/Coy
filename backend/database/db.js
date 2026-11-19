import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dbDir, 'coy.db');

let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(dbPath);
    // Optimize SQLite for concurrent reads and crash safety
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

export function queryAll(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

export function queryOne(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

export function run(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

export function exec(sql) {
  const db = getDatabase();
  return db.exec(sql);
}

export default {
  getDatabase,
  queryAll,
  queryOne,
  run,
  exec,
};

