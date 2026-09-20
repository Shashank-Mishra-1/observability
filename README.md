# 🔭 Enterprise Observability & Performance Intelligence

![UI Preview](https://img.shields.io/badge/UI-React_|_Vite-blue?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/SDKs-.NET_8_|_TypeScript-512BD4?style=for-the-badge&logo=dotnet)
![Infrastructure](https://img.shields.io/badge/Stack-OpenTelemetry_|_Jaeger-orange?style=for-the-badge&logo=opentelemetry)

A comprehensive, enterprise-grade internal engineering platform designed to provide deep, actionable insights into distributed systems. Built with a focus on P95/P99 latencies, deployment correlation, and HIPAA-compliant data masking.

## ✨ Features

*   **P95/P99 Percentile Tracking:** Moves beyond "averages" to identify intermittent timeouts and tail-latency bottlenecks that ruin user experiences.
*   **Deployment Correlation:** Automatically tracks performance regressions and error rate spikes back to specific deployments and Git commits.
*   **Database Intelligence:** First-class monitoring for database stored procedures, including row counts and exact execution times, without exposing sensitive SQL parameters.
*   **Distributed Tracing:** Seamless front-to-back W3C trace propagation, linking browser interactions directly to backend database queries.
*   **AI-Assisted Root Cause Analysis:** Synthesizes metrics, logs, and deployment events into evidence-based correlation reports.
*   **Strict PHI Safety:** Engineered from the ground up for healthcare/finance constraints—no request bodies or raw SQL queries are ever captured.

## 🚀 Quick Start

### 1. Start the Observability Infrastructure (Docker)
Spins up OpenTelemetry Collector, Prometheus, and Jaeger.
```bash
cd deploy/local
docker-compose up -d
```

### 2. Start the Intelligence Dashboard (React)
The main UI for visualizing the telemetry data.
```bash
cd src/Platform/observability-ui
npm install && npm run dev
# → Open http://localhost:3000
```

## 📂 Repository Structure

| Component | Path | Description |
| :--- | :--- | :--- |
| **Dashboard** | `src/Platform/observability-ui/` | Premium React/Vite dashboard for visualizing distributed telemetry. |
| **.NET SDK** | `src/Sdk/Company.Observability.AspNetCore/` | ASP.NET Core OpenTelemetry wrappers with automatic DI integration. |
| **Database SDK** | `src/Sdk/Company.Observability.Database/` | SQL Server / PostgreSQL interceptors for tracking stored procedures. |
| **Web SDK** | `src/Sdk/company-observability-web/` | TypeScript browser SDK for tracking Web Vitals and XHR traces. |
| **Local Stack** | `deploy/local/` | Docker Compose stack (OTel, Jaeger, Prometheus). |
| **Documentation**| `docs/` | Comprehensive architectural, integration, and security guidelines. |

## 📚 Documentation & Context

If you are setting this project up for the first time, migrating it to a new PC, or looking to understand the architectural philosophy, **start by reading [CONTEXT.md](CONTEXT.md)**.

Additional deep-dives are available in the `/docs` directory:
*   [Architecture Overview](docs/ARCHITECTURE.md)
*   [Setup Guide](docs/SETUP.md)
*   [Integration Guide](docs/INTEGRATION.md)
*   [Security & HIPAA Compliance](docs/SECURITY.md)

## 🛠 Tech Stack
*   **Frontend:** React, Vite, Recharts, Lucide-React, custom CSS.
*   **Backend SDKs:** C# 12, .NET 8, TypeScript.
*   **Observability:** OpenTelemetry (OTLP), Jaeger, Prometheus.
