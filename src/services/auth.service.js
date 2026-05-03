const { HttpError } = require("../utils/httpError");
const { UserRepository } = require("../repositories/user.repository");
const { SessionRepository } = require("../repositories/session.repository");

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
    this.sessionRepo = new SessionRepository();
  }

  async register(dto) {
    const name = String(dto.name || "").trim();
    const email = String(dto.email || "").trim().toLowerCase();
    const password = String(dto.password || "").trim();

    if (!name || !email || !password) {
      throw new HttpError(422, "VALIDATION_ERROR", "name, email y password son obligatorios");
    }

    const exists = await this.userRepo.findByEmail(email);

    if (exists) {
      throw new HttpError(409, "CONFLICT", "El email ya existe");
    }

    const user = await this.userRepo.create({
      name,
      email,
      password,
      role: "client",
      active: true
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    };
  }

  async login(dto) {
    const email = String(dto.email || "").trim().toLowerCase();
    const password = String(dto.password || "").trim();

    if (!email || !password) {
      throw new HttpError(422, "VALIDATION_ERROR", "email y password son obligatorios");
    }

    const user = await this.userRepo.findByEmail(email);

    if (!user || user.password !== password || user.active !== true) {
      throw new HttpError(401, "UNAUTHORIZED", "Credenciales inválidas");
    }

    const session = await this.sessionRepo.create(user.id);

    return {
      message: "Login correcto",
      apiKey: session.apiKey,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async logout(apiKey) {
    const session = await this.sessionRepo.deactivate(apiKey);

    if (!session) {
      throw new HttpError(404, "NOT_FOUND", "Sesión no encontrada");
    }

    return { message: "Sesión cerrada correctamente" };
  }
}

module.exports = { AuthService };
