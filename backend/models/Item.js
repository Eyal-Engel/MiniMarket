const { Model, DataTypes } = require("sequelize");

class Item extends Model {
  static associate(models) {
    Item.belongsTo(models.Supplier, {
      foreignKey: "supplier_id",
      as: "supplier",
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        minimum_amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: true,
            min: 1,
          },
        },
        supplier_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "Suppliers",
            key: "id",
          },
          allowNull: false,
        },
        supply_amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
      },
      {
        sequelize,
        modelName: "Item",
        tableName: "items",
        timestamps: true,
      }
    );
  }
}

module.exports = Item;
