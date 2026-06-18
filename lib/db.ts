import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "portal.db");

// Ensure the data directory exists
import fs from "fs";
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// ── Create tables ──────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    role        TEXT    NOT NULL DEFAULT 'staff',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name      TEXT    NOT NULL,
    contact_person    TEXT    NOT NULL,
    position          TEXT    DEFAULT '',
    email             TEXT    NOT NULL,
    phone             TEXT    DEFAULT '',
    notes             TEXT    DEFAULT '',
    opportunity_type  TEXT    NOT NULL DEFAULT 'Other',
    opportunity_other TEXT    DEFAULT '',
    event_id          INTEGER DEFAULT NULL,
    submitted_by      TEXT    NOT NULL,
    created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Migrations: add columns to existing tables if missing ──────────────
const contactCols = db.prepare("PRAGMA table_info(contacts)").all() as any[];
if (!contactCols.find((c: any) => c.name === "event_id")) {
  db.exec("ALTER TABLE contacts ADD COLUMN event_id INTEGER DEFAULT NULL");
}

// Seed default event if none exist
const eventCount = (db.prepare("SELECT COUNT(*) as cnt FROM events").get() as any).cnt;
if (eventCount === 0) {
  db.prepare("INSERT INTO events (name, is_active) VALUES (?, ?)").run(
    "Nigerian Oil & Gas Conference",
    1
  );
}

export default db;
