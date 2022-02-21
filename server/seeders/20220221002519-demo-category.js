"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const category = [
      '정육/계란', '과일', '우유/유제품', '채소', '수산/건어물', '베이커리', '간식/떡/빙과', '김치/반찬', '기타'
    ];

    let categoryData = [];
    for (let i = 0; i < category.length; i++) {
      let obj = {
        food_type: category[i],
      };
      categoryData.push(obj);
    }

    return queryInterface.bulkInsert("Categories", categoryData, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};