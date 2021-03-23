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
        foreignKey: "profileId",
        as: "profile",
      });
      Products.belongsToMany(models.Transactions, {
        as: "transactions",
        foreignKey: "productsId",
        through: {
          model: "Order",
          as: "order",
        },
      });
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
