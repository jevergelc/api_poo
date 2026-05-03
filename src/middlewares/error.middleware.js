/**
 * Middleware final de errores.
 */
function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Error interno";

  res.status(status).json({
    ok: false,
    error: { code, message }
  });
}

module.exports = { errorMiddleware };
