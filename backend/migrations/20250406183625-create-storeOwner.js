"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the StoreOwners table
    await queryInterface.createTable("StoreOwners", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Insert an initial record if the table is empty
    const [existing] = await queryInterface.sequelize.query(
      `SELECT * FROM "StoreOwners" WHERE "phone_number" = '0506076978'`
    );

    if (existing.length === 0) {
      await queryInterface.bulkInsert("StoreOwners", [
        {
          fullname: "Bracha Cohen",
          company_name: "Bracha Company",
          phone_number: "0506076978",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      console.log("Initial StoreOwner record inserted.");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StoreOwners");
  },
};
