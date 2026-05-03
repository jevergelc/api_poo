const path = require("path");
const crypto = require("crypto");
const { readJson, writeJson } = require("../utils/fileDb");

class ProductRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/products.json");
  }

  async list() {
    return await readJson(this.filePath);
  }

  async findById(id) {
    const products = await this.list();
    return products.find(product => product.id === id) || null;
  }

  async create(product) {
    const products = await this.list();

    const newProduct = {
      id: crypto.randomUUID(),
      ...product,
      active: true
    };

    products.push(newProduct);
    await writeJson(this.filePath, products);

    return newProduct;
  }

  async update(id, patch) {
    const products = await this.list();
    const index = products.findIndex(product => product.id === id);

    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...patch
    };

    await writeJson(this.filePath, products);

    return products[index];
  }

  async remove(id) {
    const products = await this.list();
    const index = products.findIndex(product => product.id === id);

    if (index === -1) return null;

    products[index].active = false;
    await writeJson(this.filePath, products);

    return products[index];
  }
}

module.exports = { ProductRepository };
