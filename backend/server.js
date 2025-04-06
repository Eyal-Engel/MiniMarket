const db = require("./models");
const dotenv = require("dotenv");
const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const generateToken = (supplierId) => {
  return jwt.sign({ supplierId }, process.env.JWT_SECRET || "secretKey", {
    expiresIn: "1h",
  });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secretKey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    req.supplierId = decoded.supplierId;
    next();
  });
};
app.post("/suppliers", async (req, res) => {
  try {
    const { company_name, phone, representative_name, password } = req.body;

    const hashedPassword = hashPassword(password);

    const supplier = await db.Supplier.create({
      company_name,
      phone,
      representative_name,
      password: hashedPassword,
    });

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res
      .status(400)
      .json({ error: "Phone number and password are required" });
  }

  try {
    const supplier = await db.Supplier.findOne({
      where: { phone },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const hashedPassword = hashPassword(password);

    if (hashedPassword !== supplier.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(supplier.id);
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/items", authenticateToken, async (req, res) => {
  try {
    const { name, price, minimum_amount, supply_amount } = req.body;

    const supplier_id = req.supplierId;

    const supplier = await db.Supplier.findByPk(supplier_id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const item = await db.Item.create({
      name,
      price,
      minimum_amount,
      supply_amount,
      supplier_id,
    });

    res.json(item);
  } catch (error) {
    console.error("Error during item creation:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/items/supplier/:supplierId", authenticateToken, async (req, res) => {
  const { supplierId } = req.params;

  try {
    const items = await db.Item.findAll({
      where: { supplier_id: supplierId },
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
});

app.post("/orders", async (req, res) => {
  const { item_id, storeOwnerId, amount } = req.body;

  try {
    const storeOwner = await db.StoreOwner.findByPk(storeOwnerId);
    if (!storeOwner) {
      return res
        .status(404)
        .send({ message: "StoreOwner not found for the given storeOwnerId" });
    }

    const item = await db.Item.findOne({ where: { id: item_id } });

    if (!item) {
      return res
        .status(404)
        .send({ message: "Item not found for the given item_id" });
    }

    const supplier_id = item.supplier_id;

    if (amount < item.minimum_amount) {
      return res
        .status(400)
        .send({ message: `Amount must be at least ${item.minimum_amount}` });
    }

    if (amount > item.supply_amount) {
      return res.status(400).send({
        message: `Not enough stock available. Available stock: ${item.supply_amount}`,
      });
    }

    const total_price = item.price * amount;

    const order = await db.Order.create({
      item_id,
      supplier_id,
      storeOwnerId,
      amount,
      total_price,
    });

    item.amount -= amount;
    await item.save();

    return res.status(201).send(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/orders/supplier/:supplierId", authenticateToken, async (req, res) => {
  const { supplierId } = req.params;

  try {
    const orders = await db.Order.findAll({
      where: { supplier_id: supplierId },
      include: [
        {
          model: db.Item,
          required: true,
        },
      ],
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ error: "No orders found for this supplier" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders for supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get(
  "/orders/storeOwner/:storeOwnerId",
  authenticateToken,
  async (req, res) => {
    const { storeOwnerId } = req.params;

    try {
      // בדוק אם storeOwnerId קיים בטבלת StoreOwner
      const storeOwner = await db.StoreOwner.findByPk(storeOwnerId);
      if (!storeOwner) {
        return res
          .status(404)
          .send({ message: "StoreOwner not found for the given storeOwnerId" });
      }

      const orders = await db.Order.findAll({
        where: { storeOwnerId },
        include: [
          {
            model: db.Item,
            required: true,
          },
        ],
      });

      if (orders.length === 0) {
        return res
          .status(404)
          .json({ error: "No orders found for this store owner" });
      }

      res.json(orders);
    } catch (error) {
      console.error("Error retrieving orders for store owner:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put("/orders/status/:orderId", authenticateToken, async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  try {
    const order = await db.Order.findByPk(orderId, {
      include: [
        {
          model: db.StoreOwner,
          as: "storeOwner",
          required: true,
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.storeOwnerId !== req.supplierId) {
      return res.status(403).json({
        error: "You are not authorized to update this order's status.",
      });
    }

    if (order.status !== "IN PROCESS") {
      return res.status(400).json({
        error:
          "You can only change the status from 'IN PROCESS' to 'PROCESSED'.",
      });
    }

    if (newStatus !== "PROCESSED") {
      return res.status(400).json({
        error: "The status can only be updated to 'PROCESSED'.",
      });
    }

    order.status = newStatus;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const syncDatabaseAndStartServer = async () => {
  try {
    await db.sequelize.sync({ force: false });

    await db.StoreOwner.addInitialStoreOwner();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error syncing the database:", err);
  }
};

syncDatabaseAndStartServer();
