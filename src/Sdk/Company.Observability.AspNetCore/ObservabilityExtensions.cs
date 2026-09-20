using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;
using OpenTelemetry.Logs;
using Company.Observability.Core;

namespace Company.Observability.AspNetCore;

public class ObservabilityOptions
{
    public bool Enabled { get; set; } = true;
    public string Project { get; set; } = string.Empty;
    public string Application { get; set; } = string.Empty;
    public string Environment { get; set; } = "Development";
    public string CollectorEndpoint { get; set; } = "http://localhost:4317";
    public double SamplingRate { get; set; } = 1.0;
    public bool UsePostgres { get; set; } = true;
    public bool UseSqlServer { get; set; } = false;
    public string? DeploymentVersion { get; set; }
}

public static class ObservabilityExtensions
{
    public static IServiceCollection AddCompanyObservability(
        this IServiceCollection services,
        Action<ObservabilityOptions> configure)
    {
        var options = new ObservabilityOptions();
        configure(options);

        if (!options.Enabled) return services;

        services.AddSingleton(options);

        services.AddOpenTelemetry()
            .ConfigureResource(resource =>
            {
                resource.AddService(
                    serviceName: $"{options.Project}.{options.Application}",
                    serviceVersion: options.DeploymentVersion ?? "unknown")
                .AddAttributes(new Dictionary<string, object>
                {
                    { ObservabilityConstants.ProjectAttribute, options.Project },
                    { ObservabilityConstants.ApplicationAttribute, options.Application },
                    { ObservabilityConstants.EnvironmentAttribute, options.Environment },
                    { ObservabilityConstants.DeploymentVersionAttribute, options.DeploymentVersion ?? "unknown" },
                });
            })
            .WithTracing(tracing =>
            {
                tracing
                    .AddSource(CompanyActivitySource.Default.Name)
                    .SetSampler(options.SamplingRate >= 1.0
                        ? new AlwaysOnSampler()
                        : new TraceIdRatioBasedSampler(options.SamplingRate))
                    .AddAspNetCoreInstrumentation(o =>
                    {
                        o.Filter = ctx =>
                            !ctx.Request.Path.StartsWithSegments("/health") &&
                            !ctx.Request.Path.StartsWithSegments("/metrics");
                        o.RecordException = true;
                    })
                    .AddHttpClientInstrumentation(o =>
                    {
                        o.RecordException = true;
                    });

                // DB instrumentation
                if (options.UsePostgres)
                    tracing.AddNpgsql();
                if (options.UseSqlServer)
                    tracing.AddSqlClientInstrumentation(o =>
                    {
                        o.SetDbStatementForStoredProcedure = true;
                        o.SetDbStatementForText = false; // avoid capturing ad-hoc SQL that might contain PHI
                    });

                tracing.AddOtlpExporter(o =>
                {
                    o.Endpoint = new Uri(options.CollectorEndpoint);
                });
            })
            .WithMetrics(metrics =>
            {
                metrics
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddRuntimeInstrumentation() // CPU, memory, GC
                    .AddOtlpExporter(o =>
                    {
                        o.Endpoint = new Uri(options.CollectorEndpoint);
                    });
            });

        // Extend ILoggingBuilder to also export logs via OTel
        services.AddLogging(logging =>
        {
            logging.AddOpenTelemetry(o =>
            {
                o.IncludeFormattedMessage = true;
                o.IncludeScopes = true;
                o.AddOtlpExporter(otlp =>
                {
                    otlp.Endpoint = new Uri(options.CollectorEndpoint);
                });
            });
        });

        return services;
    }

    /// <summary>
    /// Adds the Company Observability services using appsettings.json configuration.
    /// </summary>
    public static IServiceCollection AddCompanyObservabilityFromConfig(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        return services.AddCompanyObservability(options =>
        {
            configuration.GetSection("Observability").Bind(options);
        });
    }
}
