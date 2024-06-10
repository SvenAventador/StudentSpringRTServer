const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const ParticipantComment = sequelize.define('participant_comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

module.exports = ParticipantComment