import express from "express";

class GenericRouter {
  constructor(controller) {
    this.controller = controller;
    this.router = express.Router();
  }

  addRoute(route, middlewares) {
    this.router[route.method.toLowerCase()](
      route.path,
      ...middlewares,
      this.controller[route.handler].bind(this.controller)
    );
    return this;
  }
 
  getRouter() {
    return this.router;
  }
}

export default GenericRouter;