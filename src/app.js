const express = require("express");
const ingestRoutes = require("./routes/ingest.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const healthRoutes = require("./routes/health.routes");

const { notFound } = require("./middlewares/notFound.middleware");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use("/health", healthRoutes);
app.use("/v1/ingest", ingestRoutes);
app.use("/v1/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
