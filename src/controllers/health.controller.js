const { ok } = require("../utils/response");

function healthController(req, res) {
  return ok(res, { status: "UP" });
}

module.exports = { healthController };
