const { z } = require("zod");

// ✅ timestamp optional (ISO string) — client na bheje to server set karega
const isoDateOptional = z.string().datetime().optional();

const meterSchema = z.object({
  meterId: z.string().min(1),
  kwhConsumedAc: z.number().nonnegative(),
  voltage: z.number().positive(),
  timestamp: isoDateOptional
});

const vehicleSchema = z.object({
  vehicleId: z.string().min(1),
  soc: z.number().min(0).max(100),
  kwhDeliveredDc: z.number().nonnegative(),
  batteryTemp: z.number(),
  timestamp: isoDateOptional
});

// Polymorphic: accept either meter or vehicle payload
const ingestSchema = z.union([meterSchema, vehicleSchema]);
const ingestBatchSchema = z.array(ingestSchema).min(1).max(1000);

module.exports = { meterSchema, vehicleSchema, ingestSchema, ingestBatchSchema };
