const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = require('../config/database');

const Task = sequelize.define('task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    priorityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    {
        // Soft delete options (timestamps need to be true)
        paranoid: true
    }
);

module.exports = Task;