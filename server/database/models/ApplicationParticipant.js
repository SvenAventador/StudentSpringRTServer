const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const ApplicationParticipant = sequelize.define('application_participant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

module.exports = ApplicationParticipant