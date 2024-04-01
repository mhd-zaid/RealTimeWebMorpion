class GenericController {
  constructor(service) {
    this.service = service;
  }

  getAll(req, res) {
    return this.service.getAll(req, res);
  }

  getById(req, res) {
    return this.service.getById(req, res);
  }

  create(req, res, next) {
    return this.service.create(req, res, next);
  }

  update(req, res, next) {
    return this.service.update(req, res, next);
  }

  patch(req, res, next) {
    return this.service.patch(req, res, next);
  }

  delete(req, res) {
    return this.service.delete(req, res);
  }
}
export default GenericController;
