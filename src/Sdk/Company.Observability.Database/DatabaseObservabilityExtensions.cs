using OpenTelemetry.Trace;

namespace Company.Observability.Database;

public static class DatabaseObservabilityExtensions
{
    public static TracerProviderBuilder AddCompanyDatabaseInstrumentation(
        this TracerProviderBuilder builder,
        bool usePostgres = true)
    {
        if (usePostgres)
        {
            builder.AddNpgsql(); // Adds Npgsql OpenTelemetry instrumentation
        }
        else
        {
            // For SQL Server
            builder.AddSqlClientInstrumentation(options =>
            {
                options.SetDbStatementForText = true;
                options.SetDbStatementForStoredProcedure = true;
                // Exclude PHI or sensitive commands if necessary
            });
        }
        
        return builder;
    }
}
