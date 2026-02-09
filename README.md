# High-Scale Energy Ingestion Engine

A backend system to ingest high-frequency telemetry from **EV vehicles (DC)** and **Smart meters (AC)**, store data efficiently, and compute **24-hour performance analytics** at scale.

This project is designed keeping **real-world scale (millions of events/day)** in mind.

---

## 🚀 Features

### ✅ Polymorphic Ingestion
- Single API supports **vehicle** and **meter** telemetry
- Auto-detection based on payload structure

### ✅ Hot & Cold Data Strategy
- **Cold tables** (`*_telemetry`)
  - Append-only
  - Used for analytics & history
- **Hot tables** (`*_current`)
  - Latest state per device
  - Fast dashboard queries

### ✅ Batch Ingestion (High Scale)
- `POST /v1/ingest/batch`
- Bulk INSERT + UPSERT
- **Transactional (atomic batch)**

### ✅ Analytics API
- 24-hour rolling window
- AC vs DC energy comparison
- Efficiency calculation
- Indexed queries (no full table scans)

---

## 🧠 Architecture Overview

