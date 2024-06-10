const ErrorHandler = require("../errors/error");
const {ParticipantStatus, AccountStatus} = require("../database");

class StatusesController {
    async getAllParticipantStatus(req, res, next) {
        try {
            const status = await ParticipantStatus.findAll()
            return res.json(status)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAllAccountStatus(req, res, next) {
        try {
            const status = await AccountStatus.findAll()
            return res.json(status)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new StatusesController()