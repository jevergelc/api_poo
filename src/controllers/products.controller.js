const { ok } = require("../utils/response");
const { ProductService } = require("../services/products.service");

const service = new ProductService();

async function list(req, res, next) {
  try {
    return ok(res, 200, await service.list());
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    return ok(res, 200, await service.getById(req.params.id));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    return ok(res, 201, await service.create(req.body));
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    return ok(res, 200, await service.update(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, remove };
