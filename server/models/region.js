"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Region.hasMany(models.User, {
        foreignKey: "region_id",
        constraint: true,
      });
      models.Region.hasMany(models.Article, {
        foreignKey: "region_id",
      });
    }
  }
  Region.init(
    {
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Region",
      timestamps: false
    }
  );
  return Region;
};
