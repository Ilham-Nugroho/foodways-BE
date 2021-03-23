"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transactions.belongsTo(models.Profile, {
        as: "customer",
        foreignKey: "customerId",
      });
      Transactions.belongsTo(models.Profile, {
        as: "partner",
        foreignKey: "partnerId",
      });
      Transactions.belongsToMany(models.Products, {
        as: "products",
        foreignKey: "transactionsId",
        through: {
          model: "Order",
          as: "order",
        },
      });
    }
  }
  Transactions.init(
    {
      customerId: DataTypes.INTEGER,
      partnerId: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transactions",
    }
  );
  return Transactions;
};
