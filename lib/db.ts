import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = process.env.MONGODB_DB || "bogaty_portal";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Returns a cached MongoDB database connection.
 * Re-uses the same client across hot-reloads in development
 * and across invocations in serverless environments.
 */
export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(MONGODB_DB);

  // Create indexes for performance
  await cachedDb.collection("users").createIndex({ username: 1 }, { unique: true });
  await cachedDb.collection("contacts").createIndex({ event_id: 1 });
  await cachedDb.collection("contacts").createIndex({ created_at: -1 });

  return cachedDb;
}
