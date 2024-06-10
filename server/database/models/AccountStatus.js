const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const AccountStatus = sequelize.define('account_status', {
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

module.exports = AccountStatus