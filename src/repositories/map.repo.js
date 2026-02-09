const { getPool } = require("../config/db");

async function getMeterIdForVehicle(vehicleId) {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT meter_id FROM vehicle_meter_map WHERE vehicle_id = $1`,
    [vehicleId]
  );
  return rows[0]?.meter_id || null;
}

module.exports = { getMeterIdForVehicle };
