namespace Company.Observability.Core;

public static class ObservabilityConstants
{
    public const string TraceIdHeader = "traceparent";
    
    // Custom tags/attributes
    public const string ProjectAttribute = "company.project.id";
    public const string ApplicationAttribute = "company.application.id";
    public const string EnvironmentAttribute = "company.environment";
    public const string DeploymentVersionAttribute = "company.deployment.version";
}
