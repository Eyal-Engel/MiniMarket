"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Items",
        key: "id",
      },
      allowNull: false,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Suppliers",
        key: "id",
      },
      allowNull: false,
    },
    storeOwnerId: {
      // New field
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["WAITING", "IN PROCESS", "PROCESSED"],
      defaultValue: "WAITING",
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Minimum validation
      },
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  Order.associate = function (models) {
    Order.belongsTo(models.Item, { foreignKey: "item_id" });
    Order.belongsTo(models.Supplier, { foreignKey: "supplier_id" });
  };

  return Order;
};
