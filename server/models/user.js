const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    resetToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tentatives: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    confirmToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});

module.exports = User;