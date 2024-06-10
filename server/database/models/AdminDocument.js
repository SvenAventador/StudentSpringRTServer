const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const AdminDocument = sequelize.define('admin_document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    document: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = AdminDocument