BEGIN;

-- Critical indexes to avoid full table scan for 24h analytics
CREATE INDEX IF NOT EXISTS idx_vehicle_telemetry_vehicle_ts
ON vehicle_telemetry (vehicle_id, ts);

CREATE INDEX IF NOT EXISTS idx_meter_telemetry_meter_ts
ON meter_telemetry (meter_id, ts);

COMMIT;
