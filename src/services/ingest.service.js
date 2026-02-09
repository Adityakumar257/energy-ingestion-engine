const { detectTelemetryType } = require("../validators/type-detector");
const telemetryService = require("./telemetry.service");

function ensureTimestamp(obj) {
  if (!obj.timestamp) obj.timestamp = new Date().toISOString();
  return obj;
}

async function ingestTelemetry(payload) {
  ensureTimestamp(payload);

  const type = detectTelemetryType(payload);

  if (type === "meter") {
    await telemetryService.persistMeter(payload);
    return { type: "meter", saved: true, timestamp: payload.timestamp };
  }

  if (type === "vehicle") {
    await telemetryService.persistVehicle(payload);
    return { type: "vehicle", saved: true, timestamp: payload.timestamp };
  }

  const err = new Error("Unknown telemetry payload type");
  err.statusCode = 400;
  throw err;
}

// ✅ batch ingestion (atomic bulk persist)
async function ingestTelemetryBatch(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error("Batch payload must be a non-empty array");
    err.statusCode = 400;
    throw err;
  }

  // timestamp fill for each item (if missing)
  for (const item of items) ensureTimestamp(item);

  // persistBatch now exists and is atomic
  const summary = await telemetryService.persistBatch(items);

  return { count: items.length, summary };
}

module.exports = { ingestTelemetry, ingestTelemetryBatch };
