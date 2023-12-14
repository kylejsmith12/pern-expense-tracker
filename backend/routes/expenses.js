const { authenticateToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const multer = require("multer");

const upload = multer();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Create expenses table if not exists
const createExpensesTable = async () => {
  try {
    const result = await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        amount NUMERIC NOT NULL,
        category VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        receipt BYTEA,
        notes TEXT
      )
    `);

    console.log("Expenses table is ready");
  } catch (error) {
    console.error("Error creating expenses table:", error);
  }
};

// Call the function to create the expenses table
createExpensesTable();

// Add an expense
router.post("/", upload.none(), authenticateToken, async (req, res) => {
  //   console.log("Request received:", req);
  const { amount, category, date, notes } = req.body;
  const receipt = req.file ? req.file.buffer : null;
  const userId = req.user.id; // Assuming you have user information in the request

  try {
    const result = await pool.query(
      "INSERT INTO expenses (amount, category, date, receipt, notes, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [amount, category, date, receipt, notes, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Define a route to get expense data
router.get("/", async (req, res) => {
  console.log(req.body);
  console.log(res.body);
  try {
    // Query to get all expenses
    const result = await pool.query("SELECT * FROM expenses");

    // Send the result as JSON
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching expenses data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
