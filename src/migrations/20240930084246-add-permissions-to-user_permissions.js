'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_permissions', 'can_create', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.addColumn('user_permissions', 'can_view', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.addColumn('user_permissions', 'can_delete', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.addColumn('user_permissions', 'can_add', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_permissions', 'can_create');
    await queryInterface.removeColumn('user_permissions', 'can_view');
    await queryInterface.removeColumn('user_permissions', 'can_delete');
    await queryInterface.removeColumn('user_permissions', 'can_add');
  }
};
