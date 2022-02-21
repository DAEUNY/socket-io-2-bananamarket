'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserArticles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.Article, {
        through: "UserArticles",
        // uniqueKey: 'id',
        foreignKey: "user_id",
        // onUpdate: "CASCADE",
        // onDelete: "CASCADE",
        // sourceKey: "id",
      })
      models.Article.belongsToMany(models.User, {
        through: "UserArticles",
        // uniqueKey: 'id',
        foreignKey: "article_id",
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
        // sourceKey: 'id'
      })
    }
  }
  UserArticles.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    is_host: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserArticles',
    timestamps: false
  });
  return UserArticles;
};