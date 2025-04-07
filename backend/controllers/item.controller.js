const Item = require("../models/Item.model");
const Supplier = require("../models/Supplier.model");

exports.createItem = async (req, res) => {
  try {
    const { name, price, minimumAmount, supplyAmount } = req.body;
    const supplierId = req.user.supplierId;

    const supplier = await Supplier.findByPk(supplierId);

    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }

    const item = await Item.create({
      name,
      price,
      minimumAmount,
      supplyAmount,
      supplierId,
    });

    res.json(item);
  } catch (error) {
    console.error("Error during item creation:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsBySupplier = async (req, res) => {
  const { supplierId } = req.params;

  try {
    const items = await Item.findAll({
      where: {
        supplierId,
      },
    });

    if (items.length === 0) {
      return res
        .status(404)
        .json({ error: "No items found for this supplier" });
    }

    res.json(items);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
