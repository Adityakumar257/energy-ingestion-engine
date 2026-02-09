function detectTelemetryType(payload) {
  // Meter stream keys
  const isMeter = payload && typeof payload.meterId === "string" && payload.kwhConsumedAc != null;
  // Vehicle stream keys
  const isVehicle = payload && typeof payload.vehicleId === "string" && payload.kwhDeliveredDc != null;

  if (isMeter) return "meter";
  if (isVehicle) return "vehicle";
  return "unknown";
}

module.exports = { detectTelemetryType };
