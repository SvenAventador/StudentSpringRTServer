const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const ApplicationComment = sequelize.define('application_comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    }
})

module.exports = ApplicationComment