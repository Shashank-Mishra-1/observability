# Enterprise Observability Platform: Context & Backstory

This document provides context on **what** this repository is, **why** it was built, and **how** to get it running on a new machine. It serves as a comprehensive guide for anyone inheriting this codebase.

## 1. What is this repository?

This repository contains an **Internal Engineering Observability Platform** designed for a fictional (but realistic) enterprise organization. It was built to solve the challenges of monitoring distributed systems, specifically focusing on:

*   **P95 / P99 Latency over Averages:** Recognizing that "average" execution times hide catastrophic failures and timeouts for the 1% of users who experience them.
*   **Deployment Correlation:** Automatically correlating performance regressions and error spikes to specific application deployments and Git commits.
*   **Database & Stored Procedure Tracking:** Treating the database as a first-class citizen, monitoring execution times, timeouts, and row counts of stored procedures.
*   **PHI & HIPAA Compliance:** Ensuring that sensitive healthcare data (Parameters, raw SQL queries, HTTP bodies) is **never** captured, while still gathering actionable telemetry.
*   **Actionable AI Analysis:** Using LLM-driven correlation (simulated in the UI) to synthesize metrics, traces, and deployments into hedged, evidence-based root cause analysis.

The system is comprised of:
1.  **Observability UI (`src/Platform/observability-ui`)**: A React/Vite dashboard using `recharts` for visualization and `lucide-react` for iconography.
2.  **SDKs (`src/Sdk`)**: A collection of .NET and TypeScript SDKs designed to be distributed as internal Nuget/NPM packages. These SDKs abstract away the complexity of OpenTelemetry setup and enforce enterprise standard tagging.
3.  **Local Infrastructure (`deploy/local`)**: A Docker Compose stack containing OpenTelemetry Collector, Jaeger, Prometheus, and PostgreSQL for local testing.

---

## 2. Setting Up on a New Machine

To transfer this repository to a new PC and run it successfully, you need the following prerequisites installed:

### Prerequisites
*   **Node.js** (v18 or higher) - Required for the frontend dashboard and React demo apps.
*   **Docker Desktop** (or equivalent Docker engine) - Required to run the local OpenTelemetry, Prometheus, and Jaeger stack.
*   **Git** - To clone the repository.
*   *(Optional)* **.NET 8 SDK** - Required only if you intend to run or modify the backend C# SDKs and Demo APIs.

### Step-by-Step Setup

1.  **Clone the Repository**
    ```bash
    git clone <your-github-repo-url>
    cd Telemetry
    ```

2.  **Start the Local Infrastructure (Docker)**
    This spins up the OpenTelemetry Collector, Prometheus (Metrics), and Jaeger (Distributed Tracing).
    ```bash
    cd deploy/local
    docker-compose up -d
    ```
    *Wait a few seconds for the containers to initialize.*
    * Jaeger UI will be available at: `http://localhost:16686`
    * Prometheus will be available at: `http://localhost:9090`

3.  **Run the Observability Dashboard**
    This is the primary React UI where telemetry data is visualized.
    ```bash
    cd ../../src/Platform/observability-ui
    npm install
    npm run dev
    ```
    * The dashboard will be available at: `http://localhost:3000`

---

## 3. How the Code is Organized

*   **`/docs`**: Contains detailed architectural guidelines, security (HIPAA) constraints, and integration manuals. Start by reading `ARCHITECTURE.md`.
*   **`/src/Platform/observability-ui`**: The React dashboard. It uses a mock data layer (`src/data/demoData.ts`) to demonstrate 12 specific enterprise failure scenarios (e.g., connection pool exhaustion, hidden P99 timeouts, post-deployment regressions). The UI is styled with custom CSS to provide a premium, dark-mode "developer tool" aesthetic.
*   **`/src/Sdk`**: The internal SDKs. The philosophy here is "you don't give the portal your code; you give your code the portal's address." These SDKs inject `traceparent` headers to join frontend and backend distributed traces.
*   **`/deploy/local`**: The Docker configuration required to run the backing telemetry databases and collectors locally.

## 4. Design Philosophy & UI Highlights

The platform intentionally avoids the "generic AI dashboard" look. Instead, it features:
*   **Information Density:** Designed for engineers debugging live incidents, it packs a lot of data (percentiles, trends, badges) into tables and grids without looking cluttered.
*   **Visual Hierarchy:** Uses strict color-coding (`var(--status-error)` for critical issues, `var(--status-warn)` for warnings) and `lucide-react` icons to immediately draw the eye to bottlenecks.
*   **Hedged AI:** The AI Analysis page does not claim absolute causality. It presents *evidence-based correlations* (e.g., "Latency increase strongly correlates with deployment v2.7.4").

You can easily adapt this project by swapping out the `demoData.ts` file in the UI with live API calls to your OpenTelemetry / Prometheus backend!
