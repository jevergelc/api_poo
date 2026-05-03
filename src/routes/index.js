const express = require("express");
const router = express.Router();

const { requireApiKey } = require("../middlewares/apiKey.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const auth = require("../controllers/auth.controller");
const products = require("../controllers/products.controller");
const cart = require("../controllers/cart.controller");
const orders = require("../controllers/orders.controller");
const terms = require("../controllers/terms.controller");

router.get("/health", (req, res) => {
  res.json({ ok: true, data: { status: "ok" } });
});

// Auth público
router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);
router.post("/terms", terms.getTerms);

// Auth protegido
router.post("/auth/logout", requireApiKey, auth.logout);

// Productos: clientes y admin pueden consultar
router.get("/products", requireApiKey, products.list);
router.get("/products/:id", requireApiKey, products.getById);

// Productos: solo admin puede administrar
router.post("/products", requireApiKey, requireRole("admin"), products.create);
router.patch("/products/:id", requireApiKey, requireRole("admin"), products.update);
router.delete("/products/:id", requireApiKey, requireRole("admin"), products.remove);

// Carrito: solo client
router.post("/cart/items", requireApiKey, requireRole("client"), cart.addItem);
router.get("/cart", requireApiKey, requireRole("client"), cart.getCart);
router.delete("/cart/items/:productId", requireApiKey, requireRole("client"), cart.removeItem);
router.delete("/cart/clear", requireApiKey, requireRole("client"), cart.clearCart);

// Órdenes: solo client
router.post("/orders/pay", requireApiKey, requireRole("client"), orders.pay);
router.get("/orders/my", requireApiKey, requireRole("client"), orders.myOrders);

module.exports = router;



