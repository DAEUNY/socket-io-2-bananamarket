"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Chat.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      models.Chat.belongsTo(models.Article, {
        foreignKey: "article_id",
      });
    }
  }
  Chat.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
      },
      article_id: {
        type: DataTypes.INTEGER,
      },
      contents: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
