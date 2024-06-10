const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Participant = sequelize.define('participant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patronymic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('Мужской', 'Женский'),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telegramLink: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    placeOfStudyOfWork: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialization: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    positionOrStudyDocument: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

module.exports = Participant