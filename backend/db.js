import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log(
  "🔑 DATABASE_URL:",
  process.env.DATABASE_URL?.startsWith("postgres")
    ? "[OK]"
    : process.env.DATABASE_URL
);

pool.on("error", (err) => {
  console.error("❌ Unexpected Postgres client error", err);
});

export default pool;
