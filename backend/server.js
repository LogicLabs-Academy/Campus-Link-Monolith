import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log every request
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// Health check route
app.get("/api/health", async (req, res) => {
  console.log("➡️  GET /api/health called");
  try {
    const now = await pool.query("SELECT NOW()");
    console.log("   ✅ Database connected, time:", now.rows[0].now);
    res.json({ status: "ok", db_time: now.rows[0].now });
  } catch (err) {
    console.error("   ❌ DB health check error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Database not connected" });
  }
});

// Mount auth routes
console.log("🔗 Mounting /api/auth routes...");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`➡️  Try GET http://localhost:${PORT}/api/health`);
  console.log(`➡️  Try POST http://localhost:${PORT}/api/auth/register`);
  console.log(`➡️  Try POST http://localhost:${PORT}/api/auth/login`);
});
