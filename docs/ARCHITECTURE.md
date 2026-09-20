# Platform Architecture

This document describes the high-level architecture and telemetry flow of the Enterprise Application Observability Platform.

## 1. Overall Architecture

```mermaid
graph TD
    subgraph Client Applications
        ReactApp[React Application]
        AngularApp[Angular Application]
    end

    subgraph Platform API & Dashboard
        ObsUI[Observability UI Dashboard]
        ObsAPI[Observability API .NET]
        ObsUI --> ObsAPI
    end

    subgraph Backend Applications
        NetAPI[.NET API / Backend]
        DB[(Database: PostgreSQL/SQL Server)]
    end

    subgraph Telemetry Pipeline
        OTel[OpenTelemetry Collector]
        Jaeger[(Jaeger / Traces)]
        Prometheus[(Prometheus / Metrics)]
    end

    ReactApp -- HTTP Request --> NetAPI
    AngularApp -- HTTP Request --> NetAPI
    NetAPI -- SQL --> DB

    ReactApp -- OTLP Telemetry --> OTel
    AngularApp -- OTLP Telemetry --> OTel
    NetAPI -- OTLP Telemetry --> OTel

    OTel -- Export Traces --> Jaeger
    OTel -- Export Metrics --> Prometheus

    ObsAPI -- Query Traces --> Jaeger
    ObsAPI -- Query Metrics --> Prometheus
```

## 2. Trace Lifecycle (Frontend to Database)

```mermaid
sequenceDiagram
    participant User
    participant Browser (React)
    participant API (.NET)
    participant Database (PostgreSQL)
    
    User->>Browser (React): Click "Monthly Claims Report"
    activate Browser (React)
    Note over Browser (React): Generate Trace ID: 8f4c2a...<br/>Start Span: "MonthlyClaimsReport"
    
    Browser (React)->>API (.NET): HTTP GET /api/claims/monthly<br/>Header: traceparent
    activate API (.NET)
    Note over API (.NET): Extract traceparent.<br/>Start Span: "GET /api/claims/monthly"
    
    API (.NET)->>Database (PostgreSQL): Execute usp_GetMonthlyClaims
    activate Database (PostgreSQL)
    Note over Database (PostgreSQL): DB instrumentation active.<br/>Start Span: "Execute usp_GetMonthlyClaims"
    
    Database (PostgreSQL)-->>API (.NET): Results (Rows: 500)
    deactivate Database (PostgreSQL)
    Note over Database (PostgreSQL): End DB Span (e.g. 4.8s)
    
    API (.NET)-->>Browser (React): JSON Response
    deactivate API (.NET)
    Note over API (.NET): End API Span (e.g. 5.1s)
    
    Note over Browser (React): Process Data & Render Grid
    Browser (React)-->>User: Display Report
    deactivate Browser (React)
    Note over Browser (React): End Frontend Span (e.g. 6.9s total)
```

## 3. Telemetry Ingestion and Routing

```mermaid
graph LR
    App[Applications .NET/React] -->|OTLP gRPC/HTTP| Receiver[OTLP Receiver]
    
    subgraph OpenTelemetry Collector
        Receiver --> BatchProcessor[Batch Processor]
        BatchProcessor --> ResourceDetection[Resource Detection Processor]
        
        ResourceDetection --> TraceExporter[Jaeger Exporter]
        ResourceDetection --> MetricExporter[Prometheus Exporter]
    end
    
    TraceExporter --> Jaeger[(Jaeger DB)]
    MetricExporter --> Prometheus[(Prometheus DB)]
```
