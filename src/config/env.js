const dotenv = require("dotenv");
const { z } = require("zod");

function loadEnv() {
  dotenv.config();

  const schema = z.object({
    NODE_ENV: z.string().default("development"),
    PORT: z.coerce.number().int().positive().default(3000),

    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().int().positive().default(5432),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),

    EFFICIENCY_THRESHOLD: z.coerce.number().min(0).max(1).default(0.85)
  });

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  Object.assign(process.env, parsed.data);
}

module.exports = { loadEnv };
