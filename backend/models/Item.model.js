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
        minimumAmount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: true,
            min: 1,
          },
        },
        supplierId: {
          type: DataTypes.INTEGER,
          references: {
            model: "Suppliers",
            key: "id",
          },
          allowNull: false,
        },
        supplyAmount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: "Item",
        underscored: true,
        tableName: "items",
      }
    );
  }
}

module.exports = Item;
