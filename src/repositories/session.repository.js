const path = require("path");
const crypto = require("crypto");
const { readJson, writeJson } = require("../utils/fileDb");

class SessionRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/sessions.json");
  }

  async list() {
    return await readJson(this.filePath);
  }

  async findByApiKey(apiKey) {
    const sessions = await this.list();
    return sessions.find(session => session.apiKey === apiKey && session.active === true) || null;
  }

  async create(userId) {
    const sessions = await this.list();

    const session = {
      id: crypto.randomUUID(),
      userId,
      apiKey: crypto.randomBytes(16).toString("hex"),
      active: true,
      createdAt: new Date().toISOString()
    };

    sessions.push(session);
    await writeJson(this.filePath, sessions);

    return session;
  }

  async deactivate(apiKey) {
    const sessions = await this.list();
    const index = sessions.findIndex(session => session.apiKey === apiKey);

    if (index === -1) return null;

    sessions[index].active = false;
    await writeJson(this.filePath, sessions);

    return sessions[index];
  }
}

module.exports = { SessionRepository };
