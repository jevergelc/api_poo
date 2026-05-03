const path = require("path");
const crypto = require("crypto");
const { readJson, writeJson } = require("../utils/fileDb");

class CartRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/carts.json");
  }

  async list() {
    return await readJson(this.filePath);
  }

  async findByUserId(userId) {
    const carts = await this.list();

    let cart = carts.find(cart => cart.userId === userId && cart.status === "active");

    if (!cart) {
      cart = {
        id: crypto.randomUUID(),
        userId,
        status: "active",
        items: [],
        createdAt: new Date().toISOString()
      };

      carts.push(cart);
      await writeJson(this.filePath, carts);
    }

    return cart;
  }

  async save(cart) {
    const carts = await this.list();
    const index = carts.findIndex(item => item.id === cart.id);

    if (index === -1) {
      carts.push(cart);
    } else {
      carts[index] = cart;
    }

    await writeJson(this.filePath, carts);

    return cart;
  }
}

module.exports = { CartRepository };
