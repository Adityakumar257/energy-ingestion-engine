BEGIN;

-- Live (HOT)
CREATE TABLE IF NOT EXISTS vehicle_current (
  vehicle_id TEXT PRIMARY KEY,
  last_soc NUMERIC NOT NULL,
  last_kwh_delivered_dc NUMERIC NOT NULL,
  last_battery_temp NUMERIC NOT NULL,
  last_ts TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meter_current (
  meter_id TEXT PRIMARY KEY,
  last_kwh_consumed_ac NUMERIC NOT NULL,
  last_voltage NUMERIC NOT NULL,
  last_ts TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- History (COLD)
CREATE TABLE IF NOT EXISTS vehicle_telemetry (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  soc NUMERIC NOT NULL,
  kwh_delivered_dc NUMERIC NOT NULL,
  battery_temp NUMERIC NOT NULL,
  ts TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS meter_telemetry (
  id BIGSERIAL PRIMARY KEY,
  meter_id TEXT NOT NULL,
  kwh_consumed_ac NUMERIC NOT NULL,
  voltage NUMERIC NOT NULL,
  ts TIMESTAMPTZ NOT NULL
);

-- Mapping
CREATE TABLE IF NOT EXISTS vehicle_meter_map (
  vehicle_id TEXT PRIMARY KEY,
  meter_id TEXT NOT NULL
);

COMMIT;
