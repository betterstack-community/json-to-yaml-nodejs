import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";

const exporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
	traceExporter: exporter,
	instrumentations: [
		getNodeAutoInstrumentations({
			"@opentelemetry/instrumentation-http": {
				requestHook: (span, request) => {
					span.updateName(`HTTP ${request.method} ${request.url}`);
				},
				applyCustomAttributesOnSpan,
			},
		}),
	],
});

sdk.start();
