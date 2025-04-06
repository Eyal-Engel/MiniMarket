const { Model, DataTypes } = require("sequelize");

class Supplier extends Model {
  static associate(models) {
    // קשרים עם מודלים אחרים אם יש
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
        company_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        representative_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Supplier",
        tableName: "suppliers",
        timestamps: true,
      }
    );
  }
}

module.exports = Supplier;
