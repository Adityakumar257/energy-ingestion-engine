const { created } = require("../utils/response");
const { ingestTelemetry, ingestTelemetryBatch } = require("../services/ingest.service");

async function ingestController(req, res, next) {
  try {
    const result = await ingestTelemetry(req.validatedBody);
    return created(res, result);
  } catch (e) {
    next(e);
  }
}

async function ingestBatchController(req, res, next) {
  try {
    const result = await ingestTelemetryBatch(req.validatedBody);
    return created(res, result);
  } catch (e) {
    next(e);
  }
}

module.exports = { ingestController, ingestBatchController };
