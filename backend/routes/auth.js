import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

const makeAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

// // --------- REGISTER ----------
// router.post("/register", async (req, res) => {
//   console.log("➡️  /api/auth/register called");
//   console.log("   body:", req.body);

//   const { email, password } = req.body;
//   if (!email || !password) {
//     console.log("   ❌ missing fields");
//     return res.status(400).json({ error: "Email and password required" });
//   }

//   try {
//     // check existing
//     const check = await pool.query("SELECT id FROM users WHERE email = $1", [
//       email,
//     ]);
//     console.log("   check.rowsCount:", check.rowCount);

//     if (check.rowCount > 0) {
//       console.log("   ❌ email already exists");
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);
//     const insert = await pool.query(
//       "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
//       [email, hashed]
//     );
//     console.log("   ✅ inserted user id:", insert.rows[0].id);

//     const token = makeAccessToken(insert.rows[0]);
//     console.log("   ✅ issuing token");

//     return res.status(201).json({ token, user: insert.rows[0] });
//   } catch (err) {
//     console.error("   ❌ REGISTER ERROR:", err?.message || err);
//     return res.status(500).json({ error: "Registration failed" });
//   }
// });
router.post("/register", async (req, res) => {
  console.log("➡️  /api/auth/register called");
  console.log("   body:", req.body);
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const check = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (check.rowCount > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const insert = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashed]
    );

    const token = makeAccessToken(insert.rows[0]);
    return res.status(201).json({ token, user: insert.rows[0] });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message || err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

// --------- LOGIN ----------
router.post("/login", async (req, res) => {
  console.log("➡️  /api/auth/login called");
  console.log("   body:", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("   ❌ missing fields");
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0) {
      console.log("   ❌ no user found for email");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log("   ❌ password mismatch");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = makeAccessToken(user);
    console.log("   ✅ login success, token issued");
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("   ❌ LOGIN ERROR:", err?.message || err);
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
