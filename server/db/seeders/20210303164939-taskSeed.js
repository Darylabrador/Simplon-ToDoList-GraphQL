'use strict';

const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    var data = [];
    let currentDate = new Date();

    for (let i = 1; i < 15; i++) {
      data.push({
        title: `Tache ${i}`,
        description: faker.lorem.text(50),
        deadline: faker.date.between('2021-03-03', '2021-03-08'),
        done: faker.random.number({min: 0, max: 1}),
        userId: 1,
        priorityId: faker.random.number({min: 1, max: 3}),
        createdAt: currentDate,
        updatedAt: currentDate
      })
    }
    await queryInterface.bulkInsert('tasks', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};