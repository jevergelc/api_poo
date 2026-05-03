const { HttpError } = require("../utils/httpError");
const { ProductRepository } = require("../repositories/product.repository");

class ProductService {
  constructor() {
    this.productRepo = new ProductRepository();
  }

  async list() {
    const products = await this.productRepo.list();
    return products.filter(product => product.active === true);
  }

  async getById(id) {
    const product = await this.productRepo.findById(id);

    if (!product || product.active !== true) {
      throw new HttpError(404, "NOT_FOUND", "Producto no existe");
    }

    return product;
  }

  async create(dto) {
    const name = String(dto.name || "").trim();
    const price = dto.price;
    const stock = dto.stock;

    if (!name) {
      throw new HttpError(422, "VALIDATION_ERROR", "name es obligatorio");
    }

    if (typeof price !== "number" || price <= 0) {
      throw new HttpError(422, "VALIDATION_ERROR", "price debe ser mayor a 0");
    }

    if (typeof stock !== "number" || stock < 0) {
      throw new HttpError(422, "VALIDATION_ERROR", "stock debe ser mayor o igual a 0");
    }

    return await this.productRepo.create({ name, price, stock });
  }

  async update(id, dto) {
    const current = await this.productRepo.findById(id);

    if (!current || current.active !== true) {
      throw new HttpError(404, "NOT_FOUND", "Producto no existe");
    }

    const patch = {};

    if (dto.name !== undefined) patch.name = String(dto.name).trim();
    if (dto.price !== undefined) patch.price = dto.price;
    if (dto.stock !== undefined) patch.stock = dto.stock;

    return await this.productRepo.update(id, patch);
  }

  async remove(id) {
    const product = await this.productRepo.remove(id);

    if (!product) {
      throw new HttpError(404, "NOT_FOUND", "Producto no existe");
    }
  }
}

module.exports = { ProductService };
