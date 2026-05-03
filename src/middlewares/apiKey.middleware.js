
const { HttpError } = require("../utils/httpError");
const { SessionRepository } = require("../repositories/session.repository");
const { UserRepository } = require("../repositories/user.repository");

const sessionRepo = new SessionRepository();
const userRepo = new UserRepository();

async function requireApiKey(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      throw new HttpError(401, "UNAUTHORIZED", "Falta el header x-api-key");
    }

    const session = await sessionRepo.findByApiKey(apiKey);

    if (!session) {
      throw new HttpError(401, "UNAUTHORIZED", "ApiKey inválida o sesión inactiva");
    }

    const user = await userRepo.findById(session.userId);

    if (!user || user.active !== true) {
      throw new HttpError(401, "UNAUTHORIZED", "Usuario no válido o inactivo");
    }

    req.session = session;
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireApiKey };
