namespace Company.Observability.Core.Models;

/// <summary>
/// Represents a normalized telemetry trace capturing one user operation end-to-end.
/// </summary>
public class TraceRecord
{
    public string TraceId { get; set; } = string.Empty;
    public string ProjectId { get; set; } = string.Empty;
    public string ApplicationId { get; set; } = string.Empty;
    public string Environment { get; set; } = string.Empty;
    public string Page { get; set; } = string.Empty;
    public string Operation { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public double DurationMs { get; set; }
    public string Status { get; set; } = "ok"; // ok | error | timeout
    public string? DeploymentVersion { get; set; }
    public string? UserId { get; set; } // anonymized
    public List<SpanRecord> Spans { get; set; } = new();
}

/// <summary>
/// Represents a single instrumented unit of work within a trace.
/// </summary>
public class SpanRecord
{
    public string SpanId { get; set; } = string.Empty;
    public string TraceId { get; set; } = string.Empty;
    public string? ParentSpanId { get; set; }
    public SpanType Type { get; set; }
    public string Component { get; set; } = string.Empty;
    public string Operation { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public double DurationMs { get; set; }
    public string Status { get; set; } = "ok";
    public Dictionary<string, string> Tags { get; set; } = new();
}

public enum SpanType
{
    FrontendPage,
    FrontendRender,
    HttpRequest,
    ApiHandler,
    ServiceLayer,
    DatabaseQuery,
    StoredProcedure,
    ExternalCall
}

/// <summary>
/// Aggregated performance statistics for an endpoint, page, or procedure.
/// </summary>
public class PerformanceStats
{
    public string Key { get; set; } = string.Empty;
    public long RequestCount { get; set; }
    public double AvgMs { get; set; }
    public double MinMs { get; set; }
    public double MaxMs { get; set; }
    public double P50Ms { get; set; }
    public double P75Ms { get; set; }
    public double P90Ms { get; set; }
    public double P95Ms { get; set; }
    public double P99Ms { get; set; }
    public double ErrorRate { get; set; } // 0.0 – 1.0
    public double TimeoutRate { get; set; }
    public double Throughput { get; set; } // requests per minute
}

/// <summary>
/// Represents a deployment event. Used for regression correlation.
/// </summary>
public class DeploymentRecord
{
    public string Id { get; set; } = string.Empty;
    public string ProjectId { get; set; } = string.Empty;
    public string ApplicationId { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Environment { get; set; } = string.Empty;
    public string? CommitId { get; set; }
    public string? BuildId { get; set; }
    public DateTime DeployedAt { get; set; }
    public string DeployedBy { get; set; } = string.Empty;
    public DeploymentHealthStatus HealthStatus { get; set; } = DeploymentHealthStatus.Healthy;
    public double? P95BeforeMs { get; set; }
    public double? P95AfterMs { get; set; }
}

public enum DeploymentHealthStatus
{
    Healthy,
    Degraded,
    Regression,
    Unknown
}

/// <summary>
/// Represents a captured error event.
/// </summary>
public class ErrorRecord
{
    public string Id { get; set; } = string.Empty;
    public string TraceId { get; set; } = string.Empty;
    public string ApplicationId { get; set; } = string.Empty;
    public string Environment { get; set; } = string.Empty;
    public string ErrorType { get; set; } = string.Empty; // Exception class name
    public string Message { get; set; } = string.Empty;
    public string? StackTrace { get; set; }
    public string? Endpoint { get; set; }
    public int? HttpStatusCode { get; set; }
    public DateTime Timestamp { get; set; }
    public DateTime FirstSeen { get; set; }
    public DateTime LastSeen { get; set; }
    public int OccurrenceCount { get; set; }
    public ErrorSeverity Severity { get; set; }
    public bool IsResolved { get; set; }
}

public enum ErrorSeverity { Low, Medium, High, Critical }

/// <summary>
/// Represents a configurable alert rule.
/// </summary>
public class AlertRule
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ProjectId { get; set; } = string.Empty;
    public AlertType Type { get; set; }
    public AlertSeverity Severity { get; set; }
    public double Threshold { get; set; }
    public string Metric { get; set; } = string.Empty;
    public bool IsEnabled { get; set; } = true;
    public string? NotificationChannel { get; set; }
}

public enum AlertType
{
    P95LatencyThreshold,
    ErrorRateThreshold,
    StoredProcedureDuration,
    PerformanceDegradation,
    ApplicationUnavailable,
    SyntheticTestFailure
}

public enum AlertSeverity { Info, Warning, Critical }

/// <summary>
/// A fired alert instance.
/// </summary>
public class AlertEvent
{
    public string Id { get; set; } = string.Empty;
    public string RuleId { get; set; } = string.Empty;
    public string ApplicationId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public AlertSeverity Severity { get; set; }
    public DateTime FiredAt { get; set; }
    public bool IsAcknowledged { get; set; }
    public string? AcknowledgedBy { get; set; }
    public double? ActualValue { get; set; }
    public double? ThresholdValue { get; set; }
}

/// <summary>
/// Database stored procedure telemetry.
/// </summary>
public class StoredProcedureStats
{
    public string ProcedureName { get; set; } = string.Empty;
    public string ApplicationId { get; set; } = string.Empty;
    public string DatabaseType { get; set; } = string.Empty; // PostgreSQL | SQLServer
    public long ExecutionCount { get; set; }
    public double AvgDurationMs { get; set; }
    public double P95DurationMs { get; set; }
    public double P99DurationMs { get; set; }
    public int TimeoutCount { get; set; }
    public int ErrorCount { get; set; }
    public double AvgRowsReturned { get; set; }
    public DateTime LastExecuted { get; set; }
}

/// <summary>
/// Synthetic monitoring journey definition.
/// </summary>
public class SyntheticJourney
{
    public string Id { get; set; } = string.Empty;
    public string ProjectId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Environment { get; set; } = string.Empty;
    public string CronSchedule { get; set; } = "*/5 * * * *";
    public List<SyntheticStep> Steps { get; set; } = new();
    public bool IsEnabled { get; set; } = true;
    public SyntheticStatus LastStatus { get; set; } = SyntheticStatus.Unknown;
    public DateTime? LastRunAt { get; set; }
    public double? LastDurationMs { get; set; }
}

public class SyntheticStep
{
    public int Order { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Method { get; set; } = "GET";
    public int ExpectedStatusCode { get; set; } = 200;
    public int TimeoutMs { get; set; } = 10000;
}

public enum SyntheticStatus { Passing, Failing, Unknown }
