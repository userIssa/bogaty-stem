import { getDb } from "./db";
import bcrypt from "bcryptjs";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "BogatySTEM2026!";

async function seed() {
  const db = await getDb();

  // Seed admin user
  const existing = await db.collection("users").findOne({ username: ADMIN_USERNAME });

  if (existing) {
    console.log(`✔ Admin user "${ADMIN_USERNAME}" already exists — skipping.`);
  } else {
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
    await db.collection("users").insertOne({
      username: ADMIN_USERNAME,
      password: hash,
      role: "admin",
      created_at: new Date().toISOString(),
    });
    console.log(`✔ Admin user "${ADMIN_USERNAME}" created successfully.`);
  }

  // Seed default event
  const eventCount = await db.collection("events").countDocuments();
  if (eventCount === 0) {
    await db.collection("events").insertOne({
      name: "Nigerian Oil & Gas Conference",
      is_active: true,
      created_at: new Date().toISOString(),
    });
    console.log('✔ Default event "Nigerian Oil & Gas Conference" created.');
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
