const { ok } = require("../utils/response");
const { CartService } = require("../services/cart.service");

const service = new CartService();

async function addItem(req, res, next) {
  try {
    return ok(res, 201, await service.addItem(req.user.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function getCart(req, res, next) {
  try {
    return ok(res, 200, await service.getCart(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function removeItem(req, res, next) {
  try {
    return ok(res, 200, await service.removeItem(req.user.id, req.params.productId));
  } catch (error) {
    next(error);
  }
}

async function clearCart(req, res, next) {
  try {
    return ok(res, 200, await service.clearCart(req.user.id));
  } catch (error) {
    next(error);
  }
}

module.exports = { addItem, getCart, removeItem, clearCart };
