const Router = require('express');
const routes = new Router();
const DocumentController = require('../controllers/document');

routes.get('/', DocumentController.getAll);
routes.post('/', DocumentController.create);

module.exports = routes;
