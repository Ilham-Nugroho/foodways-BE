"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      menuName: {
        type: Sequelize.STRING,
      },
      menuPrice: {
        type: Sequelize.STRING,
      },
      menuDesc: {
        type: Sequelize.STRING,
      },
      menuImg: {
        type: Sequelize.STRING,
      },
      profileId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Profiles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Products");
  },
};
