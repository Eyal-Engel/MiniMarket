"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const StoreOwner = sequelize.define("StoreOwner", {
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
  });

  return StoreOwner;
};
