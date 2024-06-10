const Router = require('express')
const routes = new Router()
const ApplicationController = require('../controllers/application')

routes.get('/one', ApplicationController.getOne)
routes.get('/', ApplicationController.getAll)
routes.post('/', ApplicationController.create)
routes.put('/status', ApplicationController.saveApplication)
routes.put('/', ApplicationController.edit)
routes.delete('/one', ApplicationController.deleteOne)
routes.delete('/all', ApplicationController.deleteAll)

module.exports = routes