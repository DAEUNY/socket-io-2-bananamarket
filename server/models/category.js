"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Category.hasMany(models.Article, {
        foreignKey: "category_id",
        onUpdate: "CASCADE",
        constraint: true,
      });
      // models.Category.hasMany(models.Article, {foreignKey: 'CategoryId'})
    }
  }
  Category.init(
    {
      food_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Category",
      timestamps: false
    }
  );
  return Category;
};
