const Router = require('express');
const routes = new Router();
const AdminController = require('../controllers/admin');

routes.get('/participant', AdminController.getAllProfile);
routes.put('/participant', AdminController.changeAccountStatus);

routes.get('/application', AdminController.getAllApplication);
routes.put('/application', AdminController.changeApplicationStatus);

routes.get('/application/document', AdminController.getDocument);
routes.post('/application', AdminController.createDocument);

routes.put('/application/profile', AdminController.editProfile)
routes.put('/application/participant', AdminController.editParticipant)
routes.put('/application/application', AdminController.editApplication)
module.exports = routes;
