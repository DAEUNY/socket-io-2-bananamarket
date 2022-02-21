"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.Article, {
        through: "UserArticles",
        foreignKey: "user_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        sourceKey: "id",
      });
      
      models.User.hasMany(models.Report, {
        foreignKey: "user_id",
        // onUpdate: 'CASCADE'
        constraint: true,
      });
      models.User.hasMany(models.Chat, {
        foreignKey: "user_id",
        // onDelete: 'SET NULL',
        // onUpdate: 'CASCADE',
        // foreignKeyConstraint: true,
        constraint: true,
      });
      models.User.belongsTo(models.Region, {
        foreignKey: "region_id",
        // onUpdate: 'CASCADE'
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'name',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'email',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_image_key: {
        type: DataTypes.STRING,
      },
      profile_image_location: {
        type: DataTypes.STRING,
      },
      region_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      block: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "USER",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
