const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Profile = sequelize.define('profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    patronymic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('Мужской', 'Женский'),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    telegramLink: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    placeOfStudyOfWork: {
        type: DataTypes.STRING,
        allowNull: true
    },
    positionOrStudyDocument: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

module.exports = Profile