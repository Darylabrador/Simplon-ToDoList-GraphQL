'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })

    await queryInterface.addColumn('tasks', 'priorityId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Priority',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tasks', 'clientId')
    await queryInterface.removeColumn('tasks', 'priorityId')
  }
};
