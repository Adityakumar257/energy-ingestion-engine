const { getPool } = require("../config/db");
const { last24HoursRange } = require("../utils/time");
const mapRepo = require("../repositories/map.repo");

async function getVehiclePerformance24h(vehicleId) {
  const pool = getPool();
  const meterId = await mapRepo.getMeterIdForVehicle(vehicleId);

  if (!meterId) {
    const err = new Error(`No meter mapping found for vehicleId=${vehicleId}`);
    err.statusCode = 404;
    throw err;
  }

  const { start, end } = last24HoursRange(new Date());

  // Vehicle side (DC + avg temp)
  const vehicleAgg = await pool.query(
    `SELECT
        COALESCE(SUM(kwh_delivered_dc), 0) AS total_dc,
        COALESCE(AVG(battery_temp), 0) AS avg_battery_temp
     FROM vehicle_telemetry
     WHERE vehicle_id = $1 AND ts >= $2 AND ts < $3`,
    [vehicleId, start.toISOString(), end.toISOString()]
  );

  // Meter side (AC)
  const meterAgg = await pool.query(
    `SELECT
        COALESCE(SUM(kwh_consumed_ac), 0) AS total_ac
     FROM meter_telemetry
     WHERE meter_id = $1 AND ts >= $2 AND ts < $3`,
    [meterId, start.toISOString(), end.toISOString()]
  );

  const totalDc = Number(vehicleAgg.rows[0].total_dc);
  const avgBatteryTemp = Number(vehicleAgg.rows[0].avg_battery_temp);
  const totalAc = Number(meterAgg.rows[0].total_ac);

  const efficiency = totalAc > 0 ? totalDc / totalAc : null;

  return {
    vehicleId,
    meterId,
    window: { start: start.toISOString(), end: end.toISOString() },
    totals: {
      energyConsumedAc: totalAc,
      energyDeliveredDc: totalDc,
      efficiencyRatio: efficiency,
      avgBatteryTemp
    }
  };
}

module.exports = { getVehiclePerformance24h };
