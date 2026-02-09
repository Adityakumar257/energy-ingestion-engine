BEGIN;

-- Sample mappings (edit as needed)
INSERT INTO vehicle_meter_map (vehicle_id, meter_id)
VALUES
  ('V1', 'M1'),
  ('V2', 'M2')
ON CONFLICT (vehicle_id) DO UPDATE SET meter_id = EXCLUDED.meter_id;

COMMIT;
