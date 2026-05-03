const { ok } = require("../utils/response");
const { AuthService } = require("../services/auth.service");

const service = new AuthService();

async function register(req, res, next) {
  try {
    const result = await service.register(req.body);
    return ok(res, 201, result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await service.login(req.body);
    return ok(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    const result = await service.logout(apiKey);
    return ok(res, 200, result);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout };
