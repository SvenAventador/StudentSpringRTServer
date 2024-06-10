const Router = require('express')
const routes = new Router()
const AuthController = require('../controllers/auth')
const auth = require('../middlewares/auth')

routes.post('/registration', AuthController.registration)
routes.post('/login', AuthController.login)
routes.get('/auth', auth, AuthController.check)
routes.get('/logout', auth, AuthController.logout)

module.exports = routes