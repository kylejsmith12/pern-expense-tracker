// backend/controllers/authController.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../models");

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  // Implement login logic here
});

module.exports = router;
