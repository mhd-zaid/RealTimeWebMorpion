import GenericRouter from '../routes/genericRouter.js';
import GenericController from '../controllers/genericController.js';
import GenericService from '../services/genericService.js';
import db from '../../src/models/index.js';
import messageController from '../controllers/messageController.js';
const genericRoutes = [
  { method: 'POST', path: '/', handler: 'create', middlewares: [] },
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
];

const genericMessageRouter = new GenericRouter(
  new GenericController(new GenericService(db.Message)),
);
genericRoutes.forEach(route => {
    genericMessageRouter.addRoute(route, route.middlewares);
});

export default router => {
  router.use('/', genericMessageRouter.getRouter());
  router.get('/party/:id',messageController(db).getPartyMessages);
  return router;
};
