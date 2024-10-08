'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'platform', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "normal"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'platform');
  }
};
