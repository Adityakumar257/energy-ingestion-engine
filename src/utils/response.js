function ok(res, data, meta) {
  return res.status(200).json({ ok: true, data, meta: meta || null });
}

function created(res, data) {
  return res.status(201).json({ ok: true, data });
}

module.exports = { ok, created };
