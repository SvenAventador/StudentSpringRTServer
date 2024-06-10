const Router = require('express')
const routes = new Router()
const ApplicationDataController = require('../controllers/applicationData')

routes.get('/participant', ApplicationDataController.getParticipant)
routes.get('/tech', ApplicationDataController.getTechGroup)
routes.get('/direction', ApplicationDataController.getDirection)
routes.get('/nomination', ApplicationDataController.getNomination)
routes.get('/forms', ApplicationDataController.getFormParticipation)
routes.get('/vocal', ApplicationDataController.getVocalApplication)

module.exports = routes