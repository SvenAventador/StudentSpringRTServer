const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Application = sequelize.define('application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Профильная', 'Непрофильная'),
        allowNull: false
    },
    googleCloudLink: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    contactPerson: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneContactPerson: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telegramContactPerson: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fioDirector: {
        type: DataTypes.STRING,
        allowNull: false
    },
    teamName: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Application;