const { ok } = require("../utils/response");
const { OrderService } = require("../services/orders.service");

const service = new OrderService();

async function pay(req, res, next) {
  try {
    return ok(res, 200, await service.pay(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function myOrders(req, res, next) {
  try {
    return ok(res, 200, await service.listByUser(req.user.id));
  } catch (error) {
    next(error);
  }
}

module.exports = { pay, myOrders };
