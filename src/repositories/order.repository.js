const path = require("path");
const crypto = require("crypto");
const { readJson, writeJson } = require("../utils/fileDb");

class OrderRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/orders.json");
  }

  async list() {
    return await readJson(this.filePath);
  }

  async create(order) {
    const orders = await this.list();

    const newOrder = {
      id: crypto.randomUUID(),
      ...order,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    await writeJson(this.filePath, orders);

    return newOrder;
  }

  async findByUserId(userId) {
    const orders = await this.list();
    return orders.filter(order => order.userId === userId);
  }
}

module.exports = { OrderRepository };
