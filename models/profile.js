"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.hasMany(models.Products, {
        // foreignKey: "productsId",
        as: "products",
      });
      Profile.hasMany(models.Transactions, {
        foreignKey: "customerId",
        // as: "transactions",
      });
      Profile.hasMany(models.Transactions, {
        foreignKey: "partnerId",
        // as: "transactions",
      });
    }
  }
  Profile.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: DataTypes.STRING,
      avatar: DataTypes.STRING,
      location: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
