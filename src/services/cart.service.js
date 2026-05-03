const { HttpError } = require("../utils/httpError");
const { CartRepository } = require("../repositories/cart.repository");
const { ProductRepository } = require("../repositories/product.repository");

class CartService {
  constructor() {
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
  }

  async addItem(userId, dto) {
    const productId = String(dto.productId || "").trim();
    const quantity = dto.quantity;

    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      throw new HttpError(422, "VALIDATION_ERROR", "productId y quantity son obligatorios");
    }

    const product = await this.productRepo.findById(productId);

    if (!product || product.active !== true) {
      throw new HttpError(404, "NOT_FOUND", "Producto no existe");
    }

    if (product.stock < quantity) {
      throw new HttpError(409, "CONFLICT", "Stock insuficiente");
    }

    const cart = await this.cartRepo.findByUserId(userId);

    const existing = cart.items.find(item => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity
      });
    }

    return await this.cartRepo.save(cart);
  }

  async getCart(userId) {
    return await this.cartRepo.findByUserId(userId);
  }

  async removeItem(userId, productId) {
    const cart = await this.cartRepo.findByUserId(userId);

    cart.items = cart.items.filter(item => item.productId !== productId);

    return await this.cartRepo.save(cart);
  }

  async clearCart(userId) {
    const cart = await this.cartRepo.findByUserId(userId);

    cart.items = [];

    return await this.cartRepo.save(cart);
  }
}

module.exports = { CartService };
