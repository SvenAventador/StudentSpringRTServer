const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Nomination = sequelize.define('nomination', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomination: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = Nomination