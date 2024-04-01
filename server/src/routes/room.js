import GenericRouter from '../routes/genericRouter.js';
import GenericController from '../controllers/genericController.js';
import GenericService from '../services/genericService.js';
import db from '../../src/models/index.js';

const genericRoutes = [
    { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [] },
];

const genericRoomRouter = new GenericRouter(
  new GenericController(new GenericService(db.Room)),
);
genericRoutes.forEach(route => {
    genericRoomRouter.addRoute(route, route.middlewares);
});

export default router => {
  router.use('/', genericRoomRouter.getRouter());
  return router;
};
