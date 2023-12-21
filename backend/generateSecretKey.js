// generateSecretKey.js
require("dotenv").config(); // Load environment variables from .env file

const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
