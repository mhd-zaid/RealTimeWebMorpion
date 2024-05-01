import GenericRouter from '../routes/genericRouter.js';
import GenericController from '../controllers/genericController.js';
import GenericService from '../services/genericService.js';
import db from '../../src/models/index.js';
import checkAuth from "../middlewares/checkAuth.js";

const genericRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [] },
];

const genericUserRouter = new GenericRouter(
  new GenericController(new GenericService(db.User)),
);
genericRoutes.forEach(route => {
  genericUserRouter.addRoute(route, [...route.middlewares, checkAuth()]);
});

export default router => {
  router.use('/', genericUserRouter.getRouter());
  return router;
};
