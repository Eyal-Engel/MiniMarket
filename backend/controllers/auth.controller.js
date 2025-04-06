const jwt = require("jsonwebtoken");
const Supplier = require("../models/Supplier.model");
const { hashPassword } = require("../utils/hash.utility");

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res
      .status(400)
      .json({ error: "Phone number and password are required" });
  }

  try {
    const supplier = await Supplier.findOne({ where: { phone } });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== supplier.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { supplierId: supplier.id },
      process.env.JWT_SECRET || "secretKey",
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
