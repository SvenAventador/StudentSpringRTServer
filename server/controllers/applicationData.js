const ErrorHandler = require("../errors/error");
const {
    Participant,
    Direction,
    Nomination,
    FormOfParticipation, Application, ApplicationParticipant, ApplicationTechnicalGroup
} = require("../database");
const {Op} = require("sequelize");

class ApplicationDataController {
    async getParticipant(req, res, next) {
        const {profileId} = req.query
        try {
            const participants = await Participant.findAll({
                where: {
                    profileId: profileId,
                    participantStatusId: 1
                }
            })

            return res.json(participants)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getTechGroup(req, res, next) {
        try {
            const {profileId} = req.query
            const participants = await Participant.findAll({
                where: {
                    profileId: profileId,
                    participantStatusId: {
                        [Op.or]: [2, 3]
                    }
                }
            })

            return res.json(participants)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getDirection(req, res, next) {
        try {
            const direction = await Direction.findAll()
            return res.json(direction)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getNomination(req, res, next) {
        const {directionId} = req.query
        try {
            const nomination = await Nomination.findAll({where: {directionId: directionId}})
            return res.json(nomination)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getFormParticipation(req, res, next) {
        try {
            const forms = await FormOfParticipation.findAll()
            return res.json(forms)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getVocalApplication(req, res, next) {
        const {profileId} = req.query
        try {
            const data = await Application.findAll({where: {profileId}})

            return res.json(data.length);
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new ApplicationDataController()