const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const ParticipantStatus = sequelize.define('participant_status', {
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

module.exports = ParticipantStatus