const jwt = require("jsonwebtoken");

const generateToken = (supplierId) => {
  return jwt.sign({ supplierId }, process.env.JWT_SECRET || "secretKey", {
    expiresIn: "1h",
  });
};

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secretKey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    req.user.supplierId = decoded.supplierId;
    next();
  });
};

module.exports = { generateToken, authenticateToken };
