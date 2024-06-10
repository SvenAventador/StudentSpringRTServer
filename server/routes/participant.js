const Router = require('express')
const routes = new Router()
const ParticipantController = require('../controllers/participant')

routes.get('/one', ParticipantController.getOne)
routes.get('/', ParticipantController.getAll)
routes.post('/', ParticipantController.create)
routes.put('/', ParticipantController.update)
routes.put('/status', ParticipantController.saveParticipant)
routes.delete('/one', ParticipantController.deleteOne)
routes.delete('/', ParticipantController.deleteAll)

module.exports = routes