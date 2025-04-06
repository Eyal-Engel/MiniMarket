const { Model, DataTypes } = require("sequelize");

class StoreOwner extends Model {
  static associate(models) {
    // אם יש קשרים בין מודלים, כאן תוכל להוסיף אותם.
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
        timestamps: true, // אם יש תאריכים של יצירה/עדכון
      }
    );
  }
}

module.exports = StoreOwner;
