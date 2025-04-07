const jwt = require("jsonwebtoken");
const Supplier = require("../models/Supplier.model");
const { hashPassword } = require("../utils/hash.utility");

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res
      .status(400)
      .json({ error: "Phone number and password are required." });
  }

  try {
    const supplier = await Supplier.findOne({ where: { phone } });

    if (!supplier) {
      return res.status(400).json({ message: "Supplier not found." });
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== supplier.password) {
      return res.status(401).json({
        message:
          "Invalid credentials. Please check your phone number or password.",
      });
    }

    const token = jwt.sign(
      { supplierId: supplier.id },
      process.env.JWT_SECRET || "secretKey", // of couse, in production, use a more secure secret key and not set default value it will be in secrets
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
