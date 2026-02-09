const { getPool } = require("../config/db");

function dbOrClient(client) {
  return client || getPool();
}

async function insertVehicleTelemetry({ vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp }, client) {
  const db = dbOrClient(client);
  await db.query(
    `INSERT INTO vehicle_telemetry (vehicle_id, soc, kwh_delivered_dc, battery_temp, ts)
     VALUES ($1, $2, $3, $4, $5)`,
    [vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp]
  );
}

async function upsertVehicleCurrent({ vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp }, client) {
  const db = dbOrClient(client);
  await db.query(
    `INSERT INTO vehicle_current (vehicle_id, last_soc, last_kwh_delivered_dc, last_battery_temp, last_ts)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (vehicle_id)
     DO UPDATE SET
       last_soc = EXCLUDED.last_soc,
       last_kwh_delivered_dc = EXCLUDED.last_kwh_delivered_dc,
       last_battery_temp = EXCLUDED.last_battery_temp,
       last_ts = EXCLUDED.last_ts,
       updated_at = NOW()`,
    [vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp]
  );
}

async function bulkInsertVehicleTelemetry(rows, client) {
  if (!rows || rows.length === 0) return;
  const db = dbOrClient(client);

  const values = [];
  const placeholders = rows.map((r, i) => {
    const base = i * 5;
    values.push(r.vehicleId, r.soc, r.kwhDeliveredDc, r.batteryTemp, r.timestamp);
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
  });

  await db.query(
    `INSERT INTO vehicle_telemetry (vehicle_id, soc, kwh_delivered_dc, battery_temp, ts)
     VALUES ${placeholders.join(",")}`,
    values
  );
}

async function bulkUpsertVehicleCurrent(rows, client) {
  if (!rows || rows.length === 0) return;
  const db = dbOrClient(client);

  const values = [];
  const placeholders = rows.map((r, i) => {
    const base = i * 5;
    values.push(r.vehicleId, r.soc, r.kwhDeliveredDc, r.batteryTemp, r.timestamp);
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
  });

  await db.query(
    `INSERT INTO vehicle_current (vehicle_id, last_soc, last_kwh_delivered_dc, last_battery_temp, last_ts)
     VALUES ${placeholders.join(",")}
     ON CONFLICT (vehicle_id)
     DO UPDATE SET
       last_soc = EXCLUDED.last_soc,
       last_kwh_delivered_dc = EXCLUDED.last_kwh_delivered_dc,
       last_battery_temp = EXCLUDED.last_battery_temp,
       last_ts = EXCLUDED.last_ts,
       updated_at = NOW()`,
    values
  );
}

module.exports = {
  insertVehicleTelemetry,
  upsertVehicleCurrent,
  bulkInsertVehicleTelemetry,
  bulkUpsertVehicleCurrent
};
