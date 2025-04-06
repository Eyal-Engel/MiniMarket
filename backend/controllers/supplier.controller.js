const Supplier = require("../models/Supplier.model");
const { hashPassword } = require("../utils/hash.utility");

exports.createSupplier = async (req, res) => {
  try {
    const { company_name, phone, representative_name, password } = req.body;
    const hashedPassword = hashPassword(password);

    const supplier = await Supplier.create({
      company_name,
      phone,
      representative_name,
      password: hashedPassword,
    });

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
