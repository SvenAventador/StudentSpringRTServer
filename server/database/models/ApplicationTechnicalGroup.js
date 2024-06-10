const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const ApplicationTechnicalGroup = sequelize.define('application_technical_group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

module.exports = ApplicationTechnicalGroup