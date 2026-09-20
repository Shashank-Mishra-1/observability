// Central store of all demo telemetry data.
// Clearly labeled DEMO DATA - not live telemetry.
// Covers all 12 observability scenarios.

export const DEMO_LABEL = "DEMO DATA";

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const projects = [
  { id: "claims", name: "Claims Portal", apps: 2, env: ["Production", "QA"], status: "degraded" },
  { id: "hr", name: "HR Portal", apps: 1, env: ["Production"], status: "healthy" },
  { id: "finance", name: "Finance Dashboard", apps: 1, env: ["UAT"], status: "healthy" },
];

// ─── APPLICATIONS ────────────────────────────────────────────────────────────
export const applications = [
  { id: "claims-web", project: "claims", name: "ClaimsWeb", tech: "React + .NET 8", env: "Production", version: "v2.7.4", requestsPerMin: 124, errorRate: 8.2, p95Ms: 6900, p99Ms: 28400, status: "critical" },
  { id: "claims-api", project: "claims", name: "ClaimsAPI", tech: ".NET 8 ASP.NET Core", env: "Production", version: "v2.7.4", requestsPerMin: 124, errorRate: 7.8, p95Ms: 5900, p99Ms: 27800, status: "critical" },
  { id: "hr-web", project: "hr", name: "HRWeb", tech: "Angular + .NET 6", env: "Production", version: "v1.4.1", requestsPerMin: 22, errorRate: 0.5, p95Ms: 980, p99Ms: 1800, status: "healthy" },
  { id: "finance-web", project: "finance", name: "FinanceWeb", tech: "React + .NET 8", env: "UAT", version: "v3.1.0", requestsPerMin: 8, errorRate: 0.0, p95Ms: 320, p99Ms: 580, status: "healthy" },
];

// ─── TRACES ──────────────────────────────────────────────────────────────────
export const traces = [
  {
    traceId: "8f4c2a1b3d5e7f90",
    app: "ClaimsWeb",
    env: "Production",
    page: "Monthly Claims Report",
    operation: "MonthlyClaimsReport",
    timestamp: "2026-09-19T11:31:04Z",
    durationMs: 6900,
    status: "ok",
    version: "v2.7.4",
    // Scenario 1: Database is the bottleneck
    spans: [
      { id: "s1", parentId: null, type: "frontend", component: "React", operation: "Page Opened", startOffsetMs: 0, durationMs: 6900, status: "ok" },
      { id: "s2", parentId: "s1", type: "http", component: "Fetch", operation: "GET /api/claims/monthly", startOffsetMs: 100, durationMs: 5500, status: "ok", tags: { "http.method": "GET", "http.url": "/api/claims/monthly", "http.status": 200 } },
      { id: "s3", parentId: "s2", type: "api", component: ".NET API", operation: "ClaimsController.GetMonthly", startOffsetMs: 280, durationMs: 5300, status: "ok" },
      { id: "s4", parentId: "s3", type: "service", component: "ClaimsService", operation: "GetMonthlyClaims", startOffsetMs: 320, durationMs: 5100, status: "ok" },
      { id: "s5", parentId: "s4", type: "db", component: "PostgreSQL", operation: "usp_GetMonthlyClaims", startOffsetMs: 380, durationMs: 4800, status: "ok", tags: { "db.system": "postgresql", "db.rows_returned": 1247, "db.operation": "EXECUTE" }, isBottleneck: true },
      { id: "s6", parentId: "s1", type: "render", component: "React Grid", operation: "AgGrid.Bind(1247 rows)", startOffsetMs: 5800, durationMs: 800, status: "ok" },
      { id: "s7", parentId: "s1", type: "render", component: "React Charts", operation: "Chart.Render", startOffsetMs: 6200, durationMs: 600, status: "ok" },
    ],
    summary: { frontend: 1400, network: 200, api: 300, service: 200, database: 4800 }
  },
  {
    traceId: "a2b4c6d8e0f1a3b5",
    app: "ClaimsWeb",
    env: "Production",
    page: "Claims Dashboard",
    operation: "ClaimsDashboard",
    timestamp: "2026-09-19T10:02:11Z",
    durationMs: 2800,
    status: "ok",
    version: "v2.7.4",
    // Scenario 2: Post-deployment regression
    spans: [
      { id: "a1", parentId: null, type: "frontend", component: "React", operation: "Page Opened", startOffsetMs: 0, durationMs: 2800, status: "ok" },
      { id: "a2", parentId: "a1", type: "http", component: "Fetch", operation: "GET /api/claims/dashboard", startOffsetMs: 50, durationMs: 2400, status: "ok" },
      { id: "a3", parentId: "a2", type: "api", component: ".NET API", operation: "ClaimsController.GetDashboard", startOffsetMs: 120, durationMs: 2200, status: "ok" },
      { id: "a4", parentId: "a3", type: "db", component: "PostgreSQL", operation: "usp_GetClaimsSummary", startOffsetMs: 180, durationMs: 2000, status: "ok", isBottleneck: true },
      { id: "a5", parentId: "a1", type: "render", component: "React", operation: "Dashboard.Render", startOffsetMs: 2500, durationMs: 250, status: "ok" },
    ],
    summary: { frontend: 300, network: 50, api: 200, service: 0, database: 2000 }
  },
  {
    traceId: "c3d5e7f9a1b2c4d6",
    app: "ClaimsWeb",
    env: "Production",
    page: "Analytics Report",
    operation: "AnalyticsReport",
    timestamp: "2026-09-19T11:46:22Z",
    durationMs: 4200,
    status: "ok",
    version: "v2.7.4",
    // Scenario 3: Frontend bottleneck (not database)
    spans: [
      { id: "b1", parentId: null, type: "frontend", component: "React", operation: "Page Opened", startOffsetMs: 0, durationMs: 4200, status: "ok" },
      { id: "b2", parentId: "b1", type: "http", component: "Fetch", operation: "GET /api/analytics/summary", startOffsetMs: 100, durationMs: 180, status: "ok" },
      { id: "b3", parentId: "b2", type: "api", component: ".NET API", operation: "AnalyticsController.GetSummary", startOffsetMs: 150, durationMs: 150, status: "ok" },
      { id: "b4", parentId: "b3", type: "db", component: "PostgreSQL", operation: "usp_GetAnalyticsSummary", startOffsetMs: 170, durationMs: 120, status: "ok" },
      { id: "b5", parentId: "b1", type: "render", component: "React (D3 Charts)", operation: "Chart.Render (5 charts)", startOffsetMs: 380, durationMs: 3200, status: "ok", isBottleneck: true },
      { id: "b6", parentId: "b5", type: "render", component: "React Data Transform", operation: "formatDataSet(12k rows)", startOffsetMs: 400, durationMs: 800, status: "ok" },
    ],
    summary: { frontend: 3800, network: 80, api: 30, service: 0, database: 120 }
  },
  {
    traceId: "e5f7a9b1c3d4e6f8",
    app: "ClaimsWeb",
    env: "Production",
    page: "Claims Submission",
    operation: "SubmitClaim",
    timestamp: "2026-09-19T11:51:33Z",
    durationMs: 850,
    status: "error",
    version: "v2.7.4",
    // Scenario 4: Cascading error - connection pool exhausted
    spans: [
      { id: "c1", parentId: null, type: "frontend", component: "React", operation: "Form Submit", startOffsetMs: 0, durationMs: 850, status: "error" },
      { id: "c2", parentId: "c1", type: "http", component: "Fetch", operation: "POST /api/claims/submit", startOffsetMs: 50, durationMs: 750, status: "error", tags: { "http.status": 500 } },
      { id: "c3", parentId: "c2", type: "api", component: ".NET API", operation: "ClaimsController.Submit", startOffsetMs: 100, durationMs: 700, status: "error", tags: { "exception.type": "System.InvalidOperationException", "exception.message": "Connection pool exhausted. All connections are in use." }, isError: true },
    ],
    summary: { frontend: 100, network: 50, api: 700, service: 0, database: 0 }
  },
  {
    traceId: "f6a8b0c2d4e5f7a9",
    app: "ClaimsWeb",
    env: "Production",
    page: "Monthly Summary",
    operation: "MonthlySummary",
    timestamp: "2026-09-19T12:01:10Z",
    durationMs: 30000,
    status: "timeout",
    version: "v2.7.4",
    // Scenario 5: Intermittent timeout
    spans: [
      { id: "d1", parentId: null, type: "frontend", component: "React", operation: "Page Load (timed out)", startOffsetMs: 0, durationMs: 30000, status: "timeout" },
      { id: "d2", parentId: "d1", type: "http", component: "Fetch", operation: "GET /api/claims/monthly-summary", startOffsetMs: 100, durationMs: 30000, status: "timeout" },
      { id: "d3", parentId: "d2", type: "db", component: "PostgreSQL", operation: "usp_GenerateMonthlySummary", startOffsetMs: 200, durationMs: 30000, status: "timeout", isBottleneck: true, tags: { "db.timeout": true } },
    ],
    summary: { frontend: 0, network: 100, api: 100, service: 0, database: 30000 }
  },
];

// ─── API ENDPOINTS ────────────────────────────────────────────────────────────
export const apiEndpoints = [
  { id: "api1", method: "GET", endpoint: "/api/claims/monthly", app: "ClaimsWeb", requestCount: 1840, avgMs: 1900, p50Ms: 1200, p75Ms: 2800, p90Ms: 4200, p95Ms: 5900, p99Ms: 8200, errorRate: 1.2, timeoutRate: 0.65, trend: [720, 740, 1100, 5900, 6100, 5400, 5900] },
  { id: "api2", method: "GET", endpoint: "/api/claims/dashboard", app: "ClaimsWeb", requestCount: 12400, avgMs: 580, p50Ms: 420, p75Ms: 680, p90Ms: 1100, p95Ms: 1800, p99Ms: 3200, errorRate: 0.4, timeoutRate: 0.0, trend: [450, 460, 480, 1800, 1750, 1700, 1800] },
  { id: "api3", method: "GET", endpoint: "/api/analytics/summary", app: "ClaimsWeb", requestCount: 4200, avgMs: 200, p50Ms: 160, p75Ms: 220, p90Ms: 280, p95Ms: 340, p99Ms: 520, errorRate: 0.1, timeoutRate: 0.0, trend: [200, 198, 205, 210, 198, 200, 200] },
  { id: "api4", method: "POST", endpoint: "/api/claims/submit", app: "ClaimsWeb", requestCount: 720, avgMs: 620, p50Ms: 380, p75Ms: 580, p90Ms: 720, p95Ms: 850, p99Ms: 1100, errorRate: 8.2, timeoutRate: 0.0, trend: [200, 210, 210, 620, 620, 615, 620] },
  { id: "api5", method: "GET", endpoint: "/api/claims/monthly-summary", app: "ClaimsWeb", requestCount: 560, avgMs: 2100, p50Ms: 1400, p75Ms: 2800, p90Ms: 6200, p95Ms: 8500, p99Ms: 30000, errorRate: 0.9, timeoutRate: 15.0, trend: [500, 520, 510, 2100, 8400, 8500, 8500] },
  { id: "api6", method: "GET", endpoint: "/api/hr/reports", app: "HRWeb", requestCount: 380, avgMs: 710, p50Ms: 580, p75Ms: 750, p90Ms: 900, p95Ms: 1100, p99Ms: 1800, errorRate: 0.5, timeoutRate: 0.0, trend: [680, 690, 700, 710, 700, 710, 710] },
];

// ─── STORED PROCEDURES ────────────────────────────────────────────────────────
export const storedProcedures = [
  { name: "usp_GetMonthlyClaims", app: "ClaimsWeb", db: "PostgreSQL", execCount: 1840, avgMs: 1700, p95Ms: 4800, p99Ms: 8200, timeouts: 12, errors: 0, avgRows: 1247, trend: [480, 490, 490, 4800, 4900, 4700, 4800], change: "+182%" },
  { name: "usp_GenerateMonthlySummary", app: "ClaimsWeb", db: "PostgreSQL", execCount: 560, avgMs: 2100, p95Ms: 8500, p99Ms: 30000, timeouts: 84, errors: 5, avgRows: 1, trend: [500, 510, 520, 8500, 8480, 8490, 8500], change: "+1567%" },
  { name: "usp_GetClaimsSummary", app: "ClaimsWeb", db: "PostgreSQL", execCount: 12400, avgMs: 420, p95Ms: 890, p99Ms: 1200, timeouts: 0, errors: 2, avgRows: 48, trend: [390, 400, 405, 890, 880, 880, 890], change: "+128%" },
  { name: "usp_GetAnalyticsSummary", app: "ClaimsWeb", db: "PostgreSQL", execCount: 4200, avgMs: 120, p95Ms: 250, p99Ms: 400, timeouts: 0, errors: 0, avgRows: 12, trend: [115, 118, 120, 120, 119, 121, 120], change: "+4%" },
  { name: "usp_GetHRReport", app: "HRWeb", db: "SQL Server", execCount: 380, avgMs: 650, p95Ms: 1100, p99Ms: 1800, timeouts: 0, errors: 0, avgRows: 200, trend: [630, 640, 650, 650, 645, 648, 650], change: "+3%" },
];

// ─── ERRORS ──────────────────────────────────────────────────────────────────
export const errors = [
  { id: "err1", type: "System.InvalidOperationException", message: "Connection pool exhausted. All connections are in use.", app: "ClaimsWeb", endpoint: "POST /api/claims/submit", httpStatus: 500, count: 14, firstSeen: "2026-09-19T08:44:10Z", lastSeen: "2026-09-19T11:51:33Z", severity: "critical", traceId: "e5f7a9b1c3d4e6f8" },
  { id: "err2", type: "TimeoutException", message: "usp_GenerateMonthlySummary execution exceeded 30000ms command timeout.", app: "ClaimsWeb", endpoint: "GET /api/claims/monthly-summary", httpStatus: 504, count: 28, firstSeen: "2026-09-17T14:22:05Z", lastSeen: "2026-09-19T12:01:10Z", severity: "high", traceId: "f6a8b0c2d4e5f7a9" },
  { id: "err3", type: "System.NullReferenceException", message: "Object reference not set to an instance of an object. at ClaimsService.MapClaimResult()", app: "ClaimsWeb", endpoint: "GET /api/claims/detail", httpStatus: 500, count: 3, firstSeen: "2026-09-12T09:15:00Z", lastSeen: "2026-09-19T06:21:00Z", severity: "medium", traceId: null },
  { id: "err4", type: "System.UnauthorizedAccessException", message: "User does not have permission to access HR Reports.", app: "HRWeb", endpoint: "GET /api/reports/hr-summary", httpStatus: 403, count: 1, firstSeen: "2026-09-19T10:58:00Z", lastSeen: "2026-09-19T10:58:00Z", severity: "low", traceId: null },
];

// ─── DEPLOYMENTS ─────────────────────────────────────────────────────────────
export const deployments = [
  { id: "dep1", project: "ClaimsPortal", app: "ClaimsWeb", version: "v2.7.4", env: "Production", commit: "a3f9b2c", build: "build-447", deployedAt: "2026-09-19T05:01:00Z", deployedBy: "deploy-bot", health: "regression", p95Before: 720, p95After: 2800, note: "Performance regression detected. P95 increased +289%." },
  { id: "dep2", project: "ClaimsPortal", app: "ClaimsWeb", version: "v2.7.3", env: "Production", commit: "d7e1a4f", build: "build-446", deployedAt: "2026-09-16T08:30:00Z", deployedBy: "deploy-bot", health: "healthy", p95Before: 680, p95After: 720, note: "Normal post-deployment variance." },
  { id: "dep3", project: "HRPortal", app: "HRWeb", version: "v1.4.1", env: "Production", commit: "b8c2d5e", build: "build-212", deployedAt: "2026-09-18T09:00:00Z", deployedBy: "deploy-bot", health: "healthy", p95Before: 450, p95After: 460, note: null },
  { id: "dep4", project: "FinanceDashboard", app: "FinanceWeb", version: "v3.1.0", env: "UAT", commit: "c9d3e6f", build: "build-891", deployedAt: "2026-09-19T08:00:00Z", deployedBy: "qa-team", health: "unknown", p95Before: null, p95After: null, note: "Insufficient data for comparison." },
];

// ─── ALERTS ──────────────────────────────────────────────────────────────────
export const alerts = [
  { id: "al1", app: "ClaimsWeb", message: "P95 latency on GET /api/claims/monthly exceeded 5000ms threshold. Current: 6900ms.", severity: "critical", firedAt: "2026-09-19T09:31:04Z", acknowledged: false, actual: "6900ms", threshold: "5000ms" },
  { id: "al2", app: "ClaimsWeb", message: "usp_GenerateMonthlySummary timeout rate exceeded 10% threshold. Current: 15%.", severity: "critical", firedAt: "2026-09-19T12:01:10Z", acknowledged: false, actual: "15%", threshold: "10%" },
  { id: "al3", app: "ClaimsWeb", message: "Error rate on POST /api/claims/submit exceeded 5% threshold. Current: 8.2%.", severity: "critical", firedAt: "2026-09-19T11:51:33Z", acknowledged: false, actual: "8.2%", threshold: "5%" },
  { id: "al4", app: "ClaimsWeb", message: "Performance regression detected after deployment v2.7.4. P95 increased from 720ms to 2800ms (+289%).", severity: "warning", firedAt: "2026-09-19T05:31:00Z", acknowledged: true, acknowledgedBy: "dev@company.com" },
];

// ─── SYNTHETICS ──────────────────────────────────────────────────────────────
export const syntheticJourneys = [
  {
    id: "syn1", name: "Claims Report Journey", project: "ClaimsPortal", env: "Production",
    status: "failing", lastRun: "2026-09-19T12:00:00Z", durationMs: 8400,
    steps: [
      { name: "Login", url: "/login", status: "pass", durationMs: 420 },
      { name: "Navigate to Claims", url: "/claims", status: "pass", durationMs: 280 },
      { name: "Open Monthly Report", url: "/claims/monthly", status: "pass", durationMs: 6900 },
      { name: "Generate Summary", url: "/claims/monthly-summary", status: "fail", durationMs: 30000, error: "Request timed out" },
    ]
  },
  {
    id: "syn2", name: "HR Report Journey", project: "HRPortal", env: "Production",
    status: "passing", lastRun: "2026-09-19T11:55:00Z", durationMs: 1840,
    steps: [
      { name: "Login", url: "/login", status: "pass", durationMs: 380 },
      { name: "Navigate to Reports", url: "/reports", status: "pass", durationMs: 210 },
      { name: "Open HR Report", url: "/reports/hr", status: "pass", durationMs: 1250 },
    ]
  },
];

// ─── AI ANALYSIS ─────────────────────────────────────────────────────────────
export const aiAnalysis = {
  query: "Why is Claims Report slow this week?",
  generatedAt: "2026-09-19T12:05:00Z",
  disclaimer: "AI analysis is based on telemetry data. Correlation does not imply causation.",
  findings: [
    {
      category: "Database Performance",
      severity: "high",
      observation: "usp_GetMonthlyClaims observed executing at P95=4800ms compared to 7-day historical P95 of 490ms — a 880% increase.",
      evidence: ["1840 executions observed", "P95: 4800ms (current) vs 490ms (7-day avg)", "12 timeouts observed"],
      recommendation: "1. Compare query execution plans before/after v2.7.4.\n2. Check for missing indexes.\n3. Review row count changes (current avg: 1247 rows)."
    },
    {
      category: "Deployment Correlation",
      severity: "medium",
      observation: "Performance degradation correlates with deployment v2.7.4 at 05:01 UTC. P95 increased from 720ms to 2800ms within 30 minutes of deployment. This is a correlation, not confirmed causation.",
      evidence: ["v2.7.4 deployed at 05:01 UTC", "P95 before: 720ms", "P95 after: 2800ms", "Change: +289%"],
      recommendation: "Review changes in commit a3f9b2c. Check for stored procedure or schema migrations included in this release."
    },
    {
      category: "Error Rate",
      severity: "high",
      observation: "POST /api/claims/submit observed error rate of 8.2%, significantly above the baseline of 0.4%. Error type: System.InvalidOperationException — connection pool exhausted.",
      evidence: ["14 errors observed in last 4h", "Error: Connection pool exhausted", "Correlated with high database load"],
      recommendation: "Investigate database connection pool settings. High database query duration may be holding connections longer than expected."
    }
  ],
  language: "Observations use hedged language: 'observed', 'correlated with', 'likely contributor'. Do not treat as confirmed root cause without investigation."
};

// ─── PAGES ────────────────────────────────────────────────────────────────────
export const pages = [
  { name: "Monthly Claims Report", app: "ClaimsWeb", usagePerDay: 1840, avgMs: 3200, p95Ms: 6900, errorRate: 1.2, trend: "degraded", priority: "critical" },
  { name: "Claims Dashboard", app: "ClaimsWeb", usagePerDay: 12400, avgMs: 800, p95Ms: 1800, errorRate: 0.4, trend: "degraded", priority: "high" },
  { name: "Analytics Report", app: "ClaimsWeb", usagePerDay: 4200, avgMs: 2100, p95Ms: 4200, errorRate: 0.1, trend: "stable", priority: "medium" },
  { name: "Claims Submission", app: "ClaimsWeb", usagePerDay: 720, avgMs: 620, p95Ms: 850, errorRate: 8.2, trend: "degraded", priority: "critical" },
  { name: "Monthly Summary", app: "ClaimsWeb", usagePerDay: 560, avgMs: 2100, p95Ms: 8500, errorRate: 0.9, trend: "degraded", priority: "high" },
  { name: "HR Reports", app: "HRWeb", usagePerDay: 380, avgMs: 710, p95Ms: 1100, errorRate: 0.5, trend: "stable", priority: "low" },
];

// ─── PERFORMANCE TIMELINE (for trend charts) ──────────────────────────────────
export const weeklyTrend = {
  labels: ["Mon", "Tue", "Wed", "Thu Sep 19 (v2.7.4)", "Fri", "Sat", "Today"],
  claimsMonthlyP95: [720, 740, 730, 2800, 5900, 6100, 6900],
  claimsDashboardP95: [450, 460, 480, 1800, 1750, 1700, 1800],
  errorRate: [0.4, 0.3, 0.4, 2.1, 7.8, 8.0, 8.2],
};
