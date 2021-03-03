const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = require('../config/database');

const Priority = sequelize.define('Priority', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Priority;