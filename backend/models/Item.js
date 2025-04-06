"use strict";

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // הוספתי את האפשרות שה-id יתמלא אוטומטית
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // מחיר יכול להיות מספר עם נקודה עשרונית
      allowNull: false,
    },
    minimum_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1, // מינימום 2
      },
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Suppliers", // טבלת ספקים
        key: "id", // העמודה שנעשית אליה התייחסות
      },
      allowNull: false,
    },
    supply_amount: {
      // עדכון השם מ-amount ל-supply_amount
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // המלאי לא יכול להיות שלילי
      },
    },
  });

  // קשר בין ה-Item ל-Supplier
  Item.associate = (models) => {
    Item.belongsTo(models.Supplier, {
      foreignKey: "supplier_id",
      as: "supplier",
    });
  };

  return Item;
};
