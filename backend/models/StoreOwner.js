// StoreOwner model
const { Model, DataTypes } = require("sequelize");

class StoreOwner extends Model {
  static associate(models) {
    // קשר בין בעל המכולת להזמנות
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
        company_name: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "StoreOwner",
        tableName: "store_owners",
        timestamps: true,
      }
    );
  }

  static async addInitialStoreOwner() {
    // Check if the store owner already exists based on the phone number
    const storeOwnerExists = await StoreOwner.findOne({
      where: { phone_number: "0506076978" }, // Check by phone number
    });

    if (!storeOwnerExists) {
      // If not, create a new store owner
      await StoreOwner.create({
        fullname: "Bracha Cohen",
        company_name: "Bracha Company",
        phone_number: "0506076978",
      });
      console.log("Store Owner added: Bracha Cohen");
    } else {
      console.log("Store Owner with this phone number already exists.");
    }
  }
}

module.exports = StoreOwner;
