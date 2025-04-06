// routes.js (or similar routes file)
const express = require("express");
const { authenticateToken } = require("../middlewares/auth.middleware");

const supplierController = require("../controllers/supplier.controller");
const authController = require("../controllers/auth.controller");
const itemController = require("../controllers/item.controller");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.post("/suppliers", supplierController.createSupplier);
router.post("/login", authController.login);

router.post("/items", authenticateToken, itemController.createItem);
router.get(
  "/items/supplier/:supplierId",
  authenticateToken,
  itemController.getItemsBySupplier
);

router.post("/orders", orderController.createOrder);
router.get(
  "/orders/supplier/:supplierId",
  authenticateToken,
  orderController.getOrdersBySupplier
);
router.get(
  "/orders/storeOwner/:storeOwnerId",
  authenticateToken,
  orderController.getOrdersByStoreOwner
);

router.put(
  "/orders/status/:orderId",
  authenticateToken,
  orderController.updateOrderStatus
);

module.exports = router;
