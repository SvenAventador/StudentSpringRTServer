const Router = require('express')
const routes = new Router()
const ProfileController = require('../controllers/profile')

routes.get('/', ProfileController.getOne)
routes.put('/', ProfileController.edit)

module.exports = routes