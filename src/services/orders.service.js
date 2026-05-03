const { HttpError } = require("../utils/httpError");
const { OrderRepository } = require("../repositories/order.repository");
const { CartRepository } = require("../repositories/cart.repository");
const { ProductRepository } = require("../repositories/product.repository");

class OrderService {
  constructor() {
    this.orderRepo = new OrderRepository();
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
  }

  async pay(userId) {
    const cart = await this.cartRepo.findByUserId(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new HttpError(409, "CONFLICT", "El carrito está vacío");
    }

    let total = 0;

    for (const item of cart.items) {
      const product = await this.productRepo.findById(item.productId);

      if (!product || product.active !== true) {
        throw new HttpError(404, "NOT_FOUND", `Producto no existe: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new HttpError(409, "CONFLICT", `Stock insuficiente para ${product.name}`);
      }

      total += item.price * item.quantity;

      await this.productRepo.update(product.id, {
        stock: product.stock - item.quantity
      });
    }

    const order = await this.orderRepo.create({
      userId,
      items: cart.items,
      total,
      status: "paid"
    });

    cart.items = [];
    await this.cartRepo.save(cart);

    return {
      message: "Pago realizado correctamente",
      order
    };
  }

  async listByUser(userId) {
    return await this.orderRepo.findByUserId(userId);
  }
}

module.exports = { OrderService };
