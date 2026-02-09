const { ok } = require("../utils/response");
const analyticsService = require("../services/analytics.service");

async function performanceController(req, res, next) {
  try {
    const { vehicleId } = req.params;
    const result = await analyticsService.getVehiclePerformance24h(vehicleId);
    return ok(res, result);
  } catch (e) {
    next(e);
  }
}

module.exports = { performanceController };
