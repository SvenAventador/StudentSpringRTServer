const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Role = sequelize.define('role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = Role