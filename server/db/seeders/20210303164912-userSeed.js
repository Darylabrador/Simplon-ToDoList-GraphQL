'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const currentDate = new Date();
    
    const pseudo       = "admin";
    const email        = "admin@gmail.com";
    const password     = await bcrypt.hash('password', 12);
    const verifiedAt   = currentDate;
    const createdAt    = currentDate;
    const updatedAt    = currentDate;

    const cryptoToken  = await crypto.createHmac('sha256', Date.now().toString()).update(email).digest('hex');
    const confirmToken = cryptoToken.slice(0, 15);

    let data = { pseudo, email, password, confirmToken, verifiedAt, createdAt, updatedAt };
    await queryInterface.bulkInsert('users', [data], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};