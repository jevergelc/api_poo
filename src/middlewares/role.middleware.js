
const { HttpError } = require("../utils/httpError");

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!allowedRoles.includes(userRole)) {
      return next(new HttpError(403, "FORBIDDEN", "No tienes permisos para esta operación"));
    }

    next();
  };
}

module.exports = { requireRole };
