// Order model
const { Model, DataTypes } = require("sequelize");

class Order extends Model {
  static associate(models) {
    Order.belongsTo(models.Item, { foreignKey: "item_id" });
    Order.belongsTo(models.Supplier, { foreignKey: "supplier_id" });
    // קשר בין הזמנה לבעל המכולת
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
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["IN PROCESS", "PROCESSED"],
          defaultValue: "IN PROCESS",
          allowNull: false,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
          },
        },
        total_price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
      }
    );
  }
}

module.exports = Order;
