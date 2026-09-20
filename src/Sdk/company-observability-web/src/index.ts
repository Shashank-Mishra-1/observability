import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace, Span } from '@opentelemetry/api';

export interface ObservabilityConfig {
    serviceName: string;
    otlpEndpoint?: string;
    environment?: string;
    deploymentVersion?: string;
}

export class Observability {
    private static isInitialized = false;

    public static initialize(config: ObservabilityConfig) {
        if (this.isInitialized) return;

        const exporter = new OTLPTraceExporter({
            url: config.otlpEndpoint || 'http://localhost:4318/v1/traces', 
            // OTLP/HTTP default port is 4318
        });

        const provider = new WebTracerProvider({
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
                'company.environment': config.environment || 'development',
                'company.deployment.version': config.deploymentVersion || 'unknown',
            }),
        });

        provider.addSpanProcessor(new BatchSpanProcessor(exporter));

        provider.register({
            contextManager: new ZoneContextManager(),
        });

        registerInstrumentations({
            instrumentations: [
                getWebAutoInstrumentations({
                    '@opentelemetry/instrumentation-xml-http-request': {
                        propagateTraceHeaderCorsUrls: [/.+/g],
                    },
                    '@opentelemetry/instrumentation-fetch': {
                        propagateTraceHeaderCorsUrls: [/.+/g],
                    },
                }),
            ],
        });

        this.isInitialized = true;
        console.log('[Observability] Initialized for service:', config.serviceName);
    }

    public static startSpan(name: string): Span {
        const tracer = trace.getTracer('company-observability-web');
        return tracer.startSpan(name);
    }
}
