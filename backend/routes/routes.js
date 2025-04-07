const express = require("express");
const { authenticateToken } = require("../middlewares/auth.middleware");

const supplierController = require("../controllers/supplier.controller");
const authController = require("../controllers/auth.controller");
const itemController = require("../controllers/item.controller");
const orderController = require("../controllers/order.controller");

const router = express.Router();

// Supplier routes
router.post("/suppliers", supplierController.createSupplier);
router.get("/suppliers", supplierController.getAllSuppliers);

// Authentication routes
router.post("/login", authController.login);

// Item routes
router.post("/items", authenticateToken, itemController.createItem);
router.get(
  "/items/supplier/:supplierId",
  // authenticateToken, add this line if want to authenticate store owner
  itemController.getItemsBySupplier
);

// Order routes
router.post("/orders", orderController.createOrder);
router.get(
  "/orders/supplier/:supplierId",
  authenticateToken,
  orderController.getOrdersBySupplier
);
router.get(
  "/orders/storeOwner/:storeOwnerId",
  // authenticateToken, add this line if want to authenticate store owner
  orderController.getOrdersByStoreOwner
);
router.put(
  "/orders/status/:orderId",
  // authenticateToken, add this line if want to authenticate store owner
  orderController.updateOrderStatus
);

module.exports = router;
