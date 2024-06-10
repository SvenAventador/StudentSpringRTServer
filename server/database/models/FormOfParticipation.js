const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const FormOfParticipation = sequelize.define('form_participation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    form: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = FormOfParticipation