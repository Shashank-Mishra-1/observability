using System.Diagnostics;
using Company.Observability.Core.Models;

namespace Company.Observability.Core;

/// <summary>
/// Custom ActivitySource for Company instrumentation.
/// Use this to create spans in service layers that aren't auto-instrumented.
/// </summary>
public static class CompanyActivitySource
{
    public static readonly ActivitySource Default = new("Company.Observability", "1.0.0");

    /// <summary>
    /// Creates a span for a service layer operation, propagating the current trace context.
    /// </summary>
    public static Activity? StartServiceSpan(string operationName, Dictionary<string, string>? tags = null)
    {
        var activity = Default.StartActivity(operationName, ActivityKind.Internal);
        if (activity is not null && tags is not null)
        {
            foreach (var (key, value) in tags)
                activity.SetTag(key, value);
        }
        return activity;
    }

    /// <summary>
    /// Creates a span for a stored procedure call with safe metadata.
    /// Never capture PHI in parameters.
    /// </summary>
    public static Activity? StartStoredProcedureSpan(string procedureName, string databaseType = "PostgreSQL")
    {
        var activity = Default.StartActivity($"db.procedure.{procedureName}", ActivityKind.Client);
        activity?.SetTag("db.operation", "EXECUTE");
        activity?.SetTag("db.stored_procedure.name", procedureName);
        activity?.SetTag("db.system", databaseType.ToLower());
        return activity;
    }
}
