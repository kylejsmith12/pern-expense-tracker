// backend/index.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware to log requests (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Use user routes
const usersRouter = require("./routes/users");
app.use("/auth", usersRouter);

// Use expenses routes
const expensesRouter = require("./routes/expenses");
app.use("/api/expenses", expensesRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
