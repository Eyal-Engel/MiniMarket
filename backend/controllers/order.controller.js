const Item = require("../models/Item.model");
const Order = require("../models/Order.model");
const Supplier = require("../models/Supplier.model");
const StoreOwner = require("../models/StoreOwner.model");
const { ORDER_STATUSES } = require("../constants/order.constant");

exports.createOrder = async (req, res) => {
  const { itemId, storeOwnerId, amount } = req.body;

  try {
    const storeOwner = await StoreOwner.findByPk(storeOwnerId);
    if (!storeOwner) {
      return res
        .status(404)
        .send({ message: "StoreOwner not found for the given storeOwnerId" });
    }

    const item = await Item.findOne({ where: { id: itemId } });
    if (!item) {
      return res
        .status(404)
        .send({ message: "Item not found for the given itemId" });
    }

    if (amount < item.minimumAmount) {
      return res
        .status(400)
        .send({ message: `Amount must be at least ${item.minimumAmount}` });
    }

    if (amount > item.supplyAmount) {
      return res.status(400).send({
        message: `Not enough stock available. Available stock: ${item.supplyAmount}`,
      });
    }

    const totalPrice = (item.price * amount).toFixed(2);

    const order = await Order.create({
      itemId,
      supplierId: item.supplierId,
      storeOwnerId,
      amount,
      totalPrice,
    });

    item.supplyAmount -= amount;
    await item.save();

    return res.status(201).send(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getOrdersBySupplier = async (req, res) => {
  const supplierId = req.user.supplierId;

  try {
    const orders = await Order.findAll({
      where: { supplierId: supplierId },
      include: [
        {
          model: Item,
          required: true,
          attributes: ["name", "price"],
        },
        {
          model: Supplier,
          required: true,
          attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        },
        {
          model: StoreOwner,
          required: true,
          as: "storeOwner",
        },
      ],
    });

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders for supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderStatusBySupplier = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId, {
      include: [{ model: StoreOwner, as: "storeOwner", required: true }],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Future feature: Check if the user is the store owner of the order and combine it to one route
    // if (order.storeOwnerId !== req.user.supplierId) {
    //   return res.status(403).json({
    //     error: "You are not authorized to update this order's status.",
    //   });
    // }

    if (order.status !== ORDER_STATUSES.WAITING) {
      return res.status(400).json({ error: "Invalid status transition." });
    }

    if (!req?.user?.supplierId || order.supplierId !== req.user.supplierId) {
      return res.status(400).json({
        error: "You are not authorized to update this order's status",
      });
    }

    order.status = ORDER_STATUSES.IN_PROCESS;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderStatusByStoreOwner = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId, {
      include: [{ model: StoreOwner, as: "storeOwner", required: true }],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== ORDER_STATUSES.IN_PROCESS) {
      return res.status(400).json({ error: "Invalid status transition." });
    }

    order.status = ORDER_STATUSES.PROCESSED;
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
          attributes: ["name", "price"],
        },
        {
          model: Supplier,
          required: true,
          attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        },
        {
          model: StoreOwner,
          required: true,
          as: "storeOwner",
        },
      ],
    });

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders for store owner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
