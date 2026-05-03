const path = require("path");
const crypto = require("crypto");
const { readJson, writeJson } = require("../utils/fileDb");

class UserRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/users.json");
  }

  async list() {
    return await readJson(this.filePath);
  }

  async findById(id) {
    const users = await this.list();
    return users.find(user => user.id === id) || null;
  }

  async findByEmail(email) {
    const users = await this.list();
    return users.find(user => user.email === email) || null;
  }

  async create(user) {
    const users = await this.list();

    const newUser = {
      id: crypto.randomUUID(),
      ...user
    };

    users.push(newUser);
    await writeJson(this.filePath, users);

    return newUser;
  }
}

module.exports = { UserRepository };
