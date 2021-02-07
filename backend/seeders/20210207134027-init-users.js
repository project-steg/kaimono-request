'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      { name: "父", created_at: new Date(), updated_at: new Date() },
      { name: "母", created_at: new Date(), updated_at: new Date() },
      { name: "兄", created_at: new Date(), updated_at: new Date() },
      { name: "弟", created_at: new Date(), updated_at: new Date() },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  }
};
