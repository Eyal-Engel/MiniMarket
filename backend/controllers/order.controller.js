const Item = require("../models/Item.model");
const Order = require("../models/Order.model");
const StoreOwner = require("../models/StoreOwner.model");

exports.createOrder = async (req, res) => {
  const { item_id, storeOwnerId, amount } = req.body;

  try {
    const storeOwner = await StoreOwner.findByPk(storeOwnerId);
    if (!storeOwner) {
      return res
        .status(404)
        .send({ message: "StoreOwner not found for the given storeOwnerId" });
    }

    const item = await Item.findOne({ where: { id: item_id } });
    if (!item) {
      return res
        .status(404)
        .send({ message: "Item not found for the given item_id" });
    }

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

    const order = await Order.create({
      item_id,
      supplier_id: item.supplier_id,
      storeOwnerId,
      amount,
      total_price,
    });

    item.supply_amount -= amount;
    await item.save();

    return res.status(201).send(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getOrdersBySupplier = async (req, res) => {
  const { supplierId } = req.params;

  try {
    const orders = await Order.findAll({
      where: { supplier_id: supplierId },
      include: [{ model: Item, required: true }],
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
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  try {
    const order = await Order.findByPk(orderId, {
      include: [{ model: StoreOwner, as: "storeOwner", required: true }],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.storeOwnerId !== req.user.supplierId) {
      return res.status(403).json({
        error: "You are not authorized to update this order's status.",
      });
    }

    if (order.status !== "IN PROCESS" || newStatus !== "PROCESSED") {
      return res.status(400).json({ error: "Invalid status transition." });
    }

    order.status = newStatus;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrdersByStoreOwner = async (req, res) => {
  const { storeOwnerId } = req.params;

  try {
    const storeOwner = await StoreOwner.findByPk(storeOwnerId);
    if (!storeOwner) {
      return res
        .status(404)
        .send({ message: "StoreOwner not found for the given storeOwnerId" });
    }

    const orders = await Order.findAll({
      where: { storeOwnerId },
      include: [
        {
          model: Item,
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
};
