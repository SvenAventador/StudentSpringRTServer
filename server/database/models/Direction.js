const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Direction = sequelize.define('direction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    direction: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = Direction