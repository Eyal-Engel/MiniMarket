const { Model, DataTypes } = require("sequelize");

class StoreOwner extends Model {
  static associate(models) {
    StoreOwner.hasMany(models.Order, {
      foreignKey: "storeOwnerId",
      as: "orders",
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
        fullname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        companyName: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "StoreOwner",
        tableName: "store_owners",
      }
    );
  }

  static async addInitialStoreOwner() {
    const storeOwnerExists = await StoreOwner.findOne({
      where: { phoneNumber: "0506076978" },
    });

    if (!storeOwnerExists) {
      await StoreOwner.create({
        fullname: "Bracha Cohen",
        companyName: "Bracha Company",
        phoneNumber: "0506076978",
      });
      console.log("Store Owner added: Bracha Cohen");
    } else {
      console.log("Store Owner with this phone number already exists.");
    }
  }
}

module.exports = StoreOwner;
