const meterRepo = require("../repositories/meter.repo");
const vehicleRepo = require("../repositories/vehicle.repo");
const { withClient } = require("../config/db");

function normalizeTimestamp(ts) {
  const now = new Date();
  const time = ts ? new Date(ts) : now;
  if (isNaN(time.getTime())) return now.toISOString();
  if (time > now) return now.toISOString();
  return time.toISOString();
}

async function persistMeter(meter) {
  const payload = { ...meter, timestamp: normalizeTimestamp(meter.timestamp) };
  await meterRepo.insertMeterTelemetry(payload);
  await meterRepo.upsertMeterCurrent(payload);
}

async function persistVehicle(vehicle) {
  const payload = { ...vehicle, timestamp: normalizeTimestamp(vehicle.timestamp) };
  await vehicleRepo.insertVehicleTelemetry(payload);
  await vehicleRepo.upsertVehicleCurrent(payload);
}

// ✅ Atomic bulk persist for batch
async function persistBatch(items) {
  const vehicles = [];
  const meters = [];

  for (const item of items) {
    if (item.vehicleId) {
      vehicles.push({ ...item, timestamp: normalizeTimestamp(item.timestamp) });
    } else if (item.meterId) {
      meters.push({ ...item, timestamp: normalizeTimestamp(item.timestamp) });
    }
  }

  return await withClient(async (client) => {
    await client.query("BEGIN");
    try {
      // 1) Bulk history inserts
      await vehicleRepo.bulkInsertVehicleTelemetry(vehicles, client);
      await meterRepo.bulkInsertMeterTelemetry(meters, client);

      // 2) Bulk current upserts
      await vehicleRepo.bulkUpsertVehicleCurrent(vehicles, client);
      await meterRepo.bulkUpsertMeterCurrent(meters, client);

      await client.query("COMMIT");
      return { vehicles: vehicles.length, meters: meters.length, atomic: true };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });
}

module.exports = { persistMeter, persistVehicle, persistBatch };
