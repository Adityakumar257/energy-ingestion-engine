const fs = require("fs");
const path = require("path");
const { loadEnv } = require("../../config/env");
const { getPool } = require("../../config/db");

loadEnv();

async function run() {
  const pool = getPool();
  const file = path.join(__dirname, "..", "migrations", "003_seed_map.sql");
  const sql = fs.readFileSync(file, "utf8");

  console.log("🌱 Seeding mapping from 003_seed_map.sql");
  await pool.query(sql);

  await pool.end();
  console.log("✅ Seed complete");
}

run().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
