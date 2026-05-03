
function ok(res, status, data, meta) {
  const body = { ok: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

module.exports = { ok };
