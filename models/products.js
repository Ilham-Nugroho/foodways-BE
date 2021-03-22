"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Products.belongsTo(models.Profile, {
        as: "profile",
      });
      // Products.belongsTo(models.Transactions, {
      //   as: "transactions",
      // });
    }
  }
  Products.init(
    {
      menuName: DataTypes.STRING,
      menuPrice: DataTypes.STRING,
      menuDesc: DataTypes.STRING,
      menuImg: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  return Products;
};
