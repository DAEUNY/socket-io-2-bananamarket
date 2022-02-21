'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Reports', {
      fields: ['user_id'],
      type: "foreign key",
      name: "reports_user_id_fk",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint('Reports', 'reports_user_id_fk');
  }
};