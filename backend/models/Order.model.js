const { Model, DataTypes } = require("sequelize");
const { ORDER_STATUSES } = require("../constants/order.constant");

class Order extends Model {
  static associate(models) {
    Order.belongsTo(models.Item, { foreignKey: "item_id" });
    Order.belongsTo(models.Supplier, { foreignKey: "supplier_id" });
    Order.belongsTo(models.StoreOwner, {
      foreignKey: "storeOwnerId",
      as: "storeOwner",
    });
  }

  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        itemId: {
          type: DataTypes.INTEGER,
          references: {
            model: "Items",
            key: "id",
          },
          allowNull: false,
        },
        supplierId: {
          type: DataTypes.INTEGER,
          references: {
            model: "Suppliers",
            key: "id",
          },
          allowNull: false,
        },
        storeOwnerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          as: "storeOwnerId",
        },
        status: {
          type: DataTypes.ENUM,
          values: [Object.values(ORDER_STATUSES)],
          defaultValue: ORDER_STATUSES.WAITING,
          allowNull: false,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
          },
        },
        totalPrice: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "Order",
        tableName: "orders",
      }
    );
  }
}

module.exports = Order;
