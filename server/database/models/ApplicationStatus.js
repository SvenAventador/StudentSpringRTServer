const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const ApplicationStatus = sequelize.define('application_status', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = ApplicationStatus