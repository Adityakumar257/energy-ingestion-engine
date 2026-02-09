# High-Scale Energy Ingestion Engine (Node.js + PostgreSQL)

This project ingests high-frequency telemetry from **Smart Meters (AC)** and **EV/Chargers (DC)**, stores both **historical (cold)** and **current (hot/live)** data, and exposes an analytics API to compute 24-hour performance metrics.

## ✅ Key Features

- **Polymorphic Ingestion**
  - Single endpoint can accept **meter** OR **vehicle** payloads.
- **Hot + Cold Storage Pattern**
  - **Cold (History):** append-only telemetry tables (INSERT only)
  - **Hot (Current):** latest state per device (UPSERT)
- **Batch Ingestion (High Scale)**
  - `POST /v1/ingest/batch` ingests multiple events in one request
  - Uses **bulk INSERT/UPSERT**
  - Uses **transaction** → atomic batch (`atomic:true`)
- **Analytics**
  - `GET /v1/analytics/performance/:vehicleId` (last 24 hours)
  - Uses indexed queries (no full table scan)

---

## 🧠 Why Hot + Cold Tables?

### Cold Tables (History)
- Large, append-only tables
- Used for analytics, audits, trend reporting
- Never updated

### Hot Tables (Current)
- Only latest state per vehicle/meter
- Used for dashboards and real-time status
- Prevents scanning millions of history rows for "current SoC / voltage"

---

## 📦 Tech Stack

- Node.js (JavaScript)
- Express.js
- PostgreSQL (Docker)
- Zod validation
- pg (node-postgres)

---

## 📁 Folder Structure

