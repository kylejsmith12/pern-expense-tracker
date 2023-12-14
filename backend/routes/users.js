// backend/routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Register user
router.post("/register", async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;

  try {
    // Check if the username or email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      // Username or email already exists
      return res.status(400).json({ error: "Username or email already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await pool.query(
      "INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, email, hashedPassword, first_name, last_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login user
// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from the database
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    const user = result.rows[0];

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.id },
        "46bfa7fcc5135e29c5202bac00e0481aa56be91e2cbb25cba253f73500560828",
        {
          expiresIn: "1h", // Token expiration time
        }
      );

      // Attach the token to the response
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ user: user, token: token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Middleware function for token verification
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ error: "Unauthorized - Missing Token" });
  }

  jwt.verify(
    token,
    "46bfa7fcc5135e29c5202bac00e0481aa56be91e2cbb25cba253f73500560828",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Unauthorized - Invalid Token" });
      }

      // Attach the decoded information to the request for later use
      req.userId = decoded.userId;
      next();
    }
  );
};

// Protect routes by adding the verifyToken middleware
router.get("/protected-route", verifyToken, (req, res) => {
  // Access the user ID from req.userId
  res.json({ message: "Protected Route Accessed", userId: req.userId });
});

module.exports = router;
