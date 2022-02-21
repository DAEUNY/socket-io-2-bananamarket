"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'name',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'email',
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_image_key: {
        type: Sequelize.STRING,
      },
      profile_image_location: {
        type: Sequelize.STRING,
      },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      block: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "USER",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
