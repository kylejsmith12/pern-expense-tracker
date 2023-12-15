// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  console.log("middleware req: ", req);
  // console.log("res: ", res);
  const cookieHeader = req.headers.cookie;
  const token = cookieHeader && cookieHeader.split("=")[1];
  console.log("Received token", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(
    token,
    "46bfa7fcc5135e29c5202bac00e0481aa56be91e2cbb25cba253f73500560828",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = user;
      next();
    }
  );
};

module.exports = { authenticateToken };
