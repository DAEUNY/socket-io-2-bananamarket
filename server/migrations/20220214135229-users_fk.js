"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Users', {
      fields: ['region_id'],
      type: "foreign key",
      name: "users_region_id_fk",
      references: {
        table: "Regions",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint('Users', 'users_region_id_fk');
  }
};
