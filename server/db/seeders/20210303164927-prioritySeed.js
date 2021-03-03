'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    var data = [];
    let priorityArray = ['Faible', 'Moyenne', 'Forte'];
    let currentDate   = new Date();

    for(let i = 0; i < priorityArray.length; i++){
      data.push({
        label: priorityArray[i],
        createdAt: currentDate,
        updatedAt: currentDate
      })
    }
    await queryInterface.bulkInsert('priorities', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('priorities', null, {});
  }
};