const Router = require('express')
const routes = new Router()
const StatusesController = require('../controllers/statuses')

routes.get('/participant', StatusesController.getAllParticipantStatus)
routes.get('/account', StatusesController.getAllAccountStatus)

module.exports = routes