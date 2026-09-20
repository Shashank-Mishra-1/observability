using Company.Observability.Core.Models;

namespace Company.Observability.Core;

/// <summary>
/// Comprehensive seeded demo data covering all 12 observability scenarios.
/// This data is clearly labeled as DEMO DATA - not live telemetry.
/// </summary>
public static class DemoDataSeeder
{
    public static readonly string[] Projects = { "ClaimsPortal", "HRPortal", "FinanceDashboard" };

    public static List<TraceRecord> GenerateTraces()
    {
        var traces = new List<TraceRecord>();
        var now = DateTime.UtcNow;

        // Scenario 1: Slow Database Query - usp_GetMonthlyClaims 4.8s
        traces.Add(new TraceRecord
        {
            TraceId = "8f4c2a1b3d5e7f90",
            ProjectId = "ClaimsPortal",
            ApplicationId = "ClaimsWeb",
            Environment = "Production",
            Page = "Monthly Claims Report",
            Operation = "MonthlyClaimsReport",
            StartTime = now.AddHours(-2),
            DurationMs = 6900,
            Status = "ok",
            DeploymentVersion = "v2.7.4",
            Spans = new List<SpanRecord>
            {
                new() { SpanId="s1", TraceId="8f4c2a1b3d5e7f90", Type=SpanType.FrontendPage, Component="React", Operation="Page Load", StartTime=now.AddHours(-2), DurationMs=1400, Status="ok" },
                new() { SpanId="s2", TraceId="8f4c2a1b3d5e7f90", ParentSpanId="s1", Type=SpanType.HttpRequest, Component="Fetch", Operation="GET /api/claims/monthly", StartTime=now.AddHours(-2).AddMilliseconds(200), DurationMs=5500, Status="ok" },
                new() { SpanId="s3", TraceId="8f4c2a1b3d5e7f90", ParentSpanId="s2", Type=SpanType.ApiHandler, Component=".NET API", Operation="ClaimsController.GetMonthly", StartTime=now.AddHours(-2).AddMilliseconds(400), DurationMs=5300, Status="ok" },
                new() { SpanId="s4", TraceId="8f4c2a1b3d5e7f90", ParentSpanId="s3", Type=SpanType.ServiceLayer, Component="ClaimsService", Operation="GetMonthlyClaims", StartTime=now.AddHours(-2).AddMilliseconds(500), DurationMs=5100, Status="ok" },
                new() { SpanId="s5", TraceId="8f4c2a1b3d5e7f90", ParentSpanId="s4", Type=SpanType.StoredProcedure, Component="PostgreSQL", Operation="usp_GetMonthlyClaims", StartTime=now.AddHours(-2).AddMilliseconds(600), DurationMs=4800, Status="ok", Tags=new(){ {"db.rows_returned","1247"},{"db.system","postgresql"} } },
                new() { SpanId="s6", TraceId="8f4c2a1b3d5e7f90", ParentSpanId="s1", Type=SpanType.FrontendRender, Component="React Grid", Operation="Grid.Bind", StartTime=now.AddHours(-2).AddMilliseconds(5700), DurationMs=800, Status="ok" },
            }
        });

        // Scenario 2: Deployment Regression v2.7.4 - API P95 jumped to 2.8s
        traces.Add(new TraceRecord
        {
            TraceId = "a2b4c6d8e0f1a3b5",
            ProjectId = "ClaimsPortal",
            ApplicationId = "ClaimsWeb",
            Environment = "Production",
            Page = "Claims Dashboard",
            Operation = "ClaimsDashboard",
            StartTime = now.AddHours(-1).AddMinutes(-30),
            DurationMs = 2800,
            Status = "ok",
            DeploymentVersion = "v2.7.4",
            Spans = new List<SpanRecord>
            {
                new() { SpanId="s10", TraceId="a2b4c6d8e0f1a3b5", Type=SpanType.FrontendPage, Component="React", Operation="Page Load", DurationMs=300, Status="ok" },
                new() { SpanId="s11", TraceId="a2b4c6d8e0f1a3b5", ParentSpanId="s10", Type=SpanType.HttpRequest, Component="Fetch", Operation="GET /api/claims/dashboard", DurationMs=2400, Status="ok" },
                new() { SpanId="s12", TraceId="a2b4c6d8e0f1a3b5", ParentSpanId="s11", Type=SpanType.ApiHandler, Component=".NET API", Operation="ClaimsController.GetDashboard", DurationMs=2200, Status="ok" },
                new() { SpanId="s13", TraceId="a2b4c6d8e0f1a3b5", ParentSpanId="s12", Type=SpanType.StoredProcedure, Component="PostgreSQL", Operation="usp_GetClaimsSummary", DurationMs=2000, Status="ok" },
            }
        });

        // Scenario 3: Frontend Performance Issue
        traces.Add(new TraceRecord
        {
            TraceId = "c3d5e7f9a1b2c4d6",
            ProjectId = "ClaimsPortal",
            ApplicationId = "ClaimsWeb",
            Environment = "Production",
            Page = "Analytics Report",
            Operation = "AnalyticsReport",
            StartTime = now.AddMinutes(-45),
            DurationMs = 4200,
            Status = "ok",
            DeploymentVersion = "v2.7.4",
            Spans = new List<SpanRecord>
            {
                new() { SpanId="s20", TraceId="c3d5e7f9a1b2c4d6", Type=SpanType.FrontendPage, Component="React", Operation="Page Load", DurationMs=3800, Status="ok" },
                new() { SpanId="s21", TraceId="c3d5e7f9a1b2c4d6", ParentSpanId="s20", Type=SpanType.HttpRequest, Component="Fetch", Operation="GET /api/analytics/summary", DurationMs=180, Status="ok" },
                new() { SpanId="s22", TraceId="c3d5e7f9a1b2c4d6", ParentSpanId="s21", Type=SpanType.ApiHandler, Component=".NET API", Operation="AnalyticsController.GetSummary", DurationMs=150, Status="ok" },
                new() { SpanId="s23", TraceId="c3d5e7f9a1b2c4d6", ParentSpanId="s22", Type=SpanType.StoredProcedure, Component="PostgreSQL", Operation="usp_GetAnalyticsSummary", DurationMs=120, Status="ok" },
                new() { SpanId="s24", TraceId="c3d5e7f9a1b2c4d6", ParentSpanId="s20", Type=SpanType.FrontendRender, Component="React Charts", Operation="Chart.Render (D3)", DurationMs=3200, Status="ok" },
            }
        });

        // Scenario 4: Cascading Error - HTTP 500
        traces.Add(new TraceRecord
        {
            TraceId = "e5f7a9b1c3d4e6f8",
            ProjectId = "ClaimsPortal",
            ApplicationId = "ClaimsWeb",
            Environment = "Production",
            Page = "Claims Submission",
            Operation = "SubmitClaim",
            StartTime = now.AddMinutes(-20),
            DurationMs = 850,
            Status = "error",
            DeploymentVersion = "v2.7.4",
            Spans = new List<SpanRecord>
            {
                new() { SpanId="s30", TraceId="e5f7a9b1c3d4e6f8", Type=SpanType.FrontendPage, Component="React", Operation="Form Submit", DurationMs=850, Status="error" },
                new() { SpanId="s31", TraceId="e5f7a9b1c3d4e6f8", ParentSpanId="s30", Type=SpanType.HttpRequest, Component="Fetch", Operation="POST /api/claims/submit", DurationMs=750, Status="error", Tags=new(){ {"http.status_code","500"} } },
                new() { SpanId="s32", TraceId="e5f7a9b1c3d4e6f8", ParentSpanId="s31", Type=SpanType.ApiHandler, Component=".NET API", Operation="ClaimsController.Submit", DurationMs=700, Status="error", Tags=new(){ {"exception.type","System.InvalidOperationException"},{"exception.message","Connection pool exhausted"} } },
            }
        });

        // Scenario 5: Intermittent Timeout
        traces.Add(new TraceRecord
        {
            TraceId = "f6a8b0c2d4e5f7a9",
            ProjectId = "ClaimsPortal",
            ApplicationId = "ClaimsWeb",
            Environment = "Production",
            Page = "Monthly Summary",
            Operation = "MonthlySummary",
            StartTime = now.AddMinutes(-10),
            DurationMs = 30000,
            Status = "timeout",
            DeploymentVersion = "v2.7.4",
            Spans = new List<SpanRecord>
            {
                new() { SpanId="s40", TraceId="f6a8b0c2d4e5f7a9", Type=SpanType.FrontendPage, Component="React", Operation="Page Load", DurationMs=30000, Status="timeout" },
                new() { SpanId="s41", TraceId="f6a8b0c2d4e5f7a9", ParentSpanId="s40", Type=SpanType.HttpRequest, Component="Fetch", Operation="GET /api/claims/monthly-summary", DurationMs=30000, Status="timeout" },
                new() { SpanId="s42", TraceId="f6a8b0c2d4e5f7a9", ParentSpanId="s41", Type=SpanType.StoredProcedure, Component="PostgreSQL", Operation="usp_GenerateMonthlySummary", DurationMs=30000, Status="timeout" },
            }
        });

        return traces;
    }

    public static List<ErrorRecord> GenerateErrors()
    {
        var now = DateTime.UtcNow;
        return new List<ErrorRecord>
        {
            new() { Id="err1", TraceId="e5f7a9b1c3d4e6f8", ApplicationId="ClaimsWeb", Environment="Production", ErrorType="System.InvalidOperationException", Message="Connection pool exhausted. All connections are in use.", Endpoint="POST /api/claims/submit", HttpStatusCode=500, Timestamp=now.AddMinutes(-20), FirstSeen=now.AddHours(-3), LastSeen=now.AddMinutes(-20), OccurrenceCount=14, Severity=ErrorSeverity.Critical },
            new() { Id="err2", TraceId="f6a8b0c2d4e5f7a9", ApplicationId="ClaimsWeb", Environment="Production", ErrorType="TimeoutException", Message="usp_GenerateMonthlySummary execution exceeded 30000ms command timeout.", Endpoint="GET /api/claims/monthly-summary", HttpStatusCode=504, Timestamp=now.AddMinutes(-10), FirstSeen=now.AddDays(-2), LastSeen=now.AddMinutes(-10), OccurrenceCount=28, Severity=ErrorSeverity.High },
            new() { Id="err3", ApplicationId="ClaimsWeb", Environment="Production", ErrorType="System.NullReferenceException", Message="Object reference not set to an instance of an object. at ClaimsService.MapClaimResult()", Endpoint="GET /api/claims/detail", HttpStatusCode=500, Timestamp=now.AddHours(-5), FirstSeen=now.AddDays(-7), LastSeen=now.AddHours(-5), OccurrenceCount=3, Severity=ErrorSeverity.Medium },
            new() { Id="err4", ApplicationId="HRPortal", Environment="Production", ErrorType="System.UnauthorizedAccessException", Message="User does not have permission to access HR Reports.", Endpoint="GET /api/reports/hr-summary", HttpStatusCode=403, Timestamp=now.AddHours(-1), FirstSeen=now.AddHours(-1), LastSeen=now.AddHours(-1), OccurrenceCount=1, Severity=ErrorSeverity.Low },
        };
    }

    public static List<DeploymentRecord> GenerateDeployments()
    {
        var now = DateTime.UtcNow;
        return new List<DeploymentRecord>
        {
            new() { Id="dep1", ProjectId="ClaimsPortal", ApplicationId="ClaimsWeb", Version="v2.7.4", Environment="Production", CommitId="a3f9b2c", BuildId="build-447", DeployedAt=now.AddHours(-4), DeployedBy="deploy-bot", HealthStatus=DeploymentHealthStatus.Regression, P95BeforeMs=720, P95AfterMs=2800 },
            new() { Id="dep2", ProjectId="ClaimsPortal", ApplicationId="ClaimsWeb", Version="v2.7.3", Environment="Production", CommitId="d7e1a4f", BuildId="build-446", DeployedAt=now.AddDays(-3), DeployedBy="deploy-bot", HealthStatus=DeploymentHealthStatus.Healthy, P95BeforeMs=680, P95AfterMs=720 },
            new() { Id="dep3", ProjectId="HRPortal", ApplicationId="HRWeb", Version="v1.4.1", Environment="Production", CommitId="b8c2d5e", BuildId="build-212", DeployedAt=now.AddDays(-1), DeployedBy="deploy-bot", HealthStatus=DeploymentHealthStatus.Healthy, P95BeforeMs=450, P95AfterMs=460 },
            new() { Id="dep4", ProjectId="FinanceDashboard", ApplicationId="FinanceWeb", Version="v3.1.0", Environment="UAT", CommitId="c9d3e6f", BuildId="build-891", DeployedAt=now.AddHours(-6), DeployedBy="qa-team", HealthStatus=DeploymentHealthStatus.Unknown },
        };
    }

    public static List<AlertEvent> GenerateAlertEvents()
    {
        var now = DateTime.UtcNow;
        return new List<AlertEvent>
        {
            new() { Id="alert1", RuleId="rule-p95-claims", ApplicationId="ClaimsWeb", Message="P95 latency on GET /api/claims/monthly exceeded 5000ms threshold. Current: 6900ms.", Severity=AlertSeverity.Critical, FiredAt=now.AddHours(-2), IsAcknowledged=false, ActualValue=6900, ThresholdValue=5000 },
            new() { Id="alert2", RuleId="rule-timeout", ApplicationId="ClaimsWeb", Message="usp_GenerateMonthlySummary timeout rate exceeded 10% threshold. Current: 15%.", Severity=AlertSeverity.Critical, FiredAt=now.AddMinutes(-10), IsAcknowledged=false, ActualValue=15, ThresholdValue=10 },
            new() { Id="alert3", RuleId="rule-error-rate", ApplicationId="ClaimsWeb", Message="Error rate on POST /api/claims/submit exceeded 5% threshold. Current: 8.2%.", Severity=AlertSeverity.Critical, FiredAt=now.AddMinutes(-20), IsAcknowledged=false, ActualValue=8.2, ThresholdValue=5 },
            new() { Id="alert4", RuleId="rule-deployment", ApplicationId="ClaimsWeb", Message="Performance regression detected after deployment v2.7.4. P95 increased by +289%.", Severity=AlertSeverity.Warning, FiredAt=now.AddHours(-3.5), IsAcknowledged=true, AcknowledgedBy="dev@company.com" },
        };
    }

    public static List<StoredProcedureStats> GenerateProcedureStats()
    {
        return new List<StoredProcedureStats>
        {
            new() { ProcedureName="usp_GetMonthlyClaims", ApplicationId="ClaimsWeb", DatabaseType="PostgreSQL", ExecutionCount=1840, AvgDurationMs=1700, P95DurationMs=4800, P99DurationMs=8200, TimeoutCount=12, ErrorCount=0, AvgRowsReturned=1247, LastExecuted=DateTime.UtcNow.AddHours(-2) },
            new() { ProcedureName="usp_GenerateMonthlySummary", ApplicationId="ClaimsWeb", DatabaseType="PostgreSQL", ExecutionCount=560, AvgDurationMs=2100, P95DurationMs=8500, P99DurationMs=30000, TimeoutCount=84, ErrorCount=5, AvgRowsReturned=1, LastExecuted=DateTime.UtcNow.AddMinutes(-10) },
            new() { ProcedureName="usp_GetClaimsSummary", ApplicationId="ClaimsWeb", DatabaseType="PostgreSQL", ExecutionCount=12400, AvgDurationMs=420, P95DurationMs=890, P99DurationMs=1200, TimeoutCount=0, ErrorCount=2, AvgRowsReturned=48, LastExecuted=DateTime.UtcNow.AddMinutes(-5) },
            new() { ProcedureName="usp_GetHRReport", ApplicationId="HRWeb", DatabaseType="SQLServer", ExecutionCount=380, AvgDurationMs=650, P95DurationMs=1100, P99DurationMs=1800, TimeoutCount=0, ErrorCount=0, AvgRowsReturned=200, LastExecuted=DateTime.UtcNow.AddHours(-1) },
            new() { ProcedureName="usp_GetAnalyticsSummary", ApplicationId="ClaimsWeb", DatabaseType="PostgreSQL", ExecutionCount=4200, AvgDurationMs=120, P95DurationMs=250, P99DurationMs=400, TimeoutCount=0, ErrorCount=0, AvgRowsReturned=12, LastExecuted=DateTime.UtcNow.AddMinutes(-45) },
        };
    }
}
