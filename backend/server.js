"use strict";

const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const db = require("./models");
const dotenv = require("dotenv");
const { exec } = require("child_process");

dotenv.config(); // Load environment variables from a .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Hash password using SHA-256
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Generate JWT Token
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
    req.supplierId = decoded.supplierId; // Attach the supplierId to the request object
    next();
  });
};

// Registration - Create a Supplier
app.post("/suppliers", async (req, res) => {
  try {
    const { company_name, phone, representative_name, password } = req.body;

    // Hash the password using SHA-256
    const hashedPassword = hashPassword(password);

    // Create a new supplier
    const supplier = await db.Supplier.create({
      company_name,
      phone,
      representative_name,
      password: hashedPassword, // Store the hashed password
    });

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login - Authenticate Supplier and Generate JWT
app.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  // Validate if phone and password are provided
  if (!phone || !password) {
    return res
      .status(400)
      .json({ error: "Phone number and password are required" });
  }

  try {
    // Check if the supplier exists based on the phone number
    const supplier = await db.Supplier.findOne({
      where: { phone },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Hash the password and check if it matches the stored password
    const hashedPassword = hashPassword(password);

    if (hashedPassword !== supplier.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = generateToken(supplier.id);
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new item (Item)
app.post("/items", authenticateToken, async (req, res) => {
  try {
    const { name, price, minimum_amount, supply_amount } = req.body;

    // The supplier_id is already included in the token's authorization
    const supplier_id = req.supplierId;

    // Verify if the supplier exists (the supplier from the token must exist)
    const supplier = await db.Supplier.findByPk(supplier_id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Create a new item
    const item = await db.Item.create({
      name,
      price,
      minimum_amount,
      supply_amount,
      supplier_id, // Link with Supplier
    });

    res.json(item);
  } catch (error) {
    console.error("Error during item creation:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all items for a specific supplier
app.get("/items/supplier/:supplierId", authenticateToken, async (req, res) => {
  const { supplierId } = req.params;

  try {
    // Get items for the supplier
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

// Create an order
app.post("/orders", async (req, res) => {
  const { item_id, storeOwnerId, amount } = req.body;

  try {
    // בדוק אם storeOwnerId קיים בטבלת StoreOwner
    const storeOwner = await db.StoreOwner.findByPk(storeOwnerId);
    if (!storeOwner) {
      return res
        .status(404)
        .send({ message: "StoreOwner not found for the given storeOwnerId" });
    }

    // Fetch the item based on item_id
    const item = await db.Item.findOne({ where: { id: item_id } });

    if (!item) {
      return res
        .status(404)
        .send({ message: "Item not found for the given item_id" });
    }

    // Get the supplier_id from the item
    const supplier_id = item.supplier_id;

    // Check if the requested quantity meets the minimum requirement
    if (amount < item.minimum_amount) {
      return res
        .status(400)
        .send({ message: `Amount must be at least ${item.minimum_amount}` });
    }

    // Check if the requested quantity exceeds the available stock
    if (amount > item.supply_amount) {
      return res.status(400).send({
        message: `Not enough stock available. Available stock: ${item.supply_amount}`,
      });
    }

    // Calculate total price (price per item * amount)
    const total_price = item.price * amount;

    // Create the order
    const order = await db.Order.create({
      item_id,
      supplier_id,
      storeOwnerId,
      amount,
      total_price,
    });

    // Update the stock after the order
    item.amount -= amount; // Reduce stock by the ordered amount
    await item.save(); // Save the updated stock

    return res.status(201).send(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all orders for a specific supplier
app.get("/orders/supplier/:supplierId", authenticateToken, async (req, res) => {
  const { supplierId } = req.params;

  try {
    // Get orders for the supplier
    const orders = await db.Order.findAll({
      where: { supplier_id: supplierId },
      include: [
        {
          model: db.Item, // Include item details
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

// Get all orders for a specific storeOwner
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

      // Get orders for the store owner
      const orders = await db.Order.findAll({
        where: { storeOwnerId },
        include: [
          {
            model: db.Item, // Include item details
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

// Sync the database and start the server with migrations
const syncDatabaseAndStartServer = () => {
  exec("sequelize-cli db:migrate", (err, stdout, stderr) => {
    if (err) {
      console.error("Error running migrations:", err);
      return;
    }
    console.log("Migrations completed.");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });
};

syncDatabaseAndStartServer();
