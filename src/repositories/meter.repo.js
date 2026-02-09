const { getPool } = require("../config/db");

function dbOrClient(client) {
  return client || getPool();
}

async function insertMeterTelemetry({ meterId, kwhConsumedAc, voltage, timestamp }, client) {
  const db = dbOrClient(client);
  await db.query(
    `INSERT INTO meter_telemetry (meter_id, kwh_consumed_ac, voltage, ts)
     VALUES ($1, $2, $3, $4)`,
    [meterId, kwhConsumedAc, voltage, timestamp]
  );
}

async function upsertMeterCurrent({ meterId, kwhConsumedAc, voltage, timestamp }, client) {
  const db = dbOrClient(client);
  await db.query(
    `INSERT INTO meter_current (meter_id, last_kwh_consumed_ac, last_voltage, last_ts)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (meter_id)
     DO UPDATE SET
       last_kwh_consumed_ac = EXCLUDED.last_kwh_consumed_ac,
       last_voltage = EXCLUDED.last_voltage,
       last_ts = EXCLUDED.last_ts,
       updated_at = NOW()`,
    [meterId, kwhConsumedAc, voltage, timestamp]
  );
}

async function bulkInsertMeterTelemetry(rows, client) {
  if (!rows || rows.length === 0) return;
  const db = dbOrClient(client);

  const values = [];
  const placeholders = rows.map((r, i) => {
    const base = i * 4;
    values.push(r.meterId, r.kwhConsumedAc, r.voltage, r.timestamp);
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
  });

  await db.query(
    `INSERT INTO meter_telemetry (meter_id, kwh_consumed_ac, voltage, ts)
     VALUES ${placeholders.join(",")}`,
    values
  );
}

async function bulkUpsertMeterCurrent(rows, client) {
  if (!rows || rows.length === 0) return;
  const db = dbOrClient(client);

  const values = [];
  const placeholders = rows.map((r, i) => {
    const base = i * 4;
    values.push(r.meterId, r.kwhConsumedAc, r.voltage, r.timestamp);
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
  });

  await db.query(
    `INSERT INTO meter_current (meter_id, last_kwh_consumed_ac, last_voltage, last_ts)
     VALUES ${placeholders.join(",")}
     ON CONFLICT (meter_id)
     DO UPDATE SET
       last_kwh_consumed_ac = EXCLUDED.last_kwh_consumed_ac,
       last_voltage = EXCLUDED.last_voltage,
       last_ts = EXCLUDED.last_ts,
       updated_at = NOW()`,
    values
  );
}

module.exports = {
  insertMeterTelemetry,
  upsertMeterCurrent,
  bulkInsertMeterTelemetry,
  bulkUpsertMeterCurrent
};
