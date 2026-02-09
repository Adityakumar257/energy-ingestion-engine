const fs = require("fs");
const path = require("path");
const { loadEnv } = require("../../config/env");
const { getPool } = require("../../config/db");

loadEnv();

async function run() {
  const pool = getPool();
  const dir = path.join(__dirname, "..", "migrations");

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log("🧱 Running migrations:", files);

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    console.log(`➡️  Applying ${file}`);
    await pool.query(sql);
  }

  await pool.end();
  console.log("✅ Migrations complete");
}

run().catch((e) => {
  console.error("❌ Migration failed:", e);
  process.exit(1);
});
