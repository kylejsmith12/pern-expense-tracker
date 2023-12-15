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
  const userId = req.user.userId; // Assuming you have user information in the request
  console.log("req user", req.user);
  console.log("req", req);

  console.log("req user", req.user.userId);

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
  // console.log(req.body);
  // console.log(res.body);
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

// Delete an expense by ID
router.delete("/:id", authenticateToken, async (req, res) => {
  const expenseId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *",
      [expenseId, req.user.id]
    );
    // console.log("result: ", result);
    if (result.rows.length > 0) {
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete all expenses
router.delete("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM expenses WHERE user_id = $1 RETURNING *",
      [req.user.id]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: "All expenses deleted successfully" });
    } else {
      res.status(404).json({ error: "No expenses found" });
    }
  } catch (error) {
    console.error("Error deleting all expenses:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
