/**
 * Seed script — run once to create the initial admin user.
 * Usage:  npx tsx lib/seed.ts
 */
import db from "./db";
import bcrypt from "bcryptjs";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "BogatySTEM2026!";

const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(ADMIN_USERNAME);

if (existing) {
  console.log(`✔ Admin user "${ADMIN_USERNAME}" already exists — skipping.`);
} else {
  const hash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run(
    ADMIN_USERNAME,
    hash,
    "admin"
  );
  console.log(`✔ Admin user "${ADMIN_USERNAME}" created successfully.`);
}

process.exit(0);
