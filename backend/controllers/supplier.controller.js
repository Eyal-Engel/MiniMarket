const Supplier = require("../models/Supplier.model");
const { hashPassword } = require("../utils/hash.utility");

// יצירת ספק חדש
exports.createSupplier = async (req, res) => {
  try {
    const { companyName, phone, representativeName, password } = req.body;

    // בדיקת שדות חובה
    if (!companyName || !phone || !representativeName || !password) {
      return res.status(400).json({
        error:
          "All fields are required: companyName, phone, representativeName, password",
      });
    }

    // בדיקה אם הספק כבר קיים
    const existingSupplier = await Supplier.findOne({ where: { phone } });
    if (existingSupplier) {
      return res.status(400).json({
        error: `A supplier with this phone number already exists.`,
      });
    }

    // יצירת הספק
    const hashedPassword = hashPassword(password);
    const supplier = await Supplier.create({
      companyName,
      phone,
      representativeName,
      password: hashedPassword,
    });

    res.status(201).json(supplier);
  } catch (error) {
    // טיפול בשגיאות ולידציה של Sequelize
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => err.message);
      return res.status(400).json({
        error: "Validation error",
        details: validationErrors,
      });
    }

    console.error("Error creating supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// שליפת כל הספקים
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      attributes: ["id", "companyName", "representativeName"], // בוחרים רק את השדות הרצויים
    });

    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};
