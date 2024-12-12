import process from "node:process";
import { trace } from "@opentelemetry/api";
import { stringify } from "yaml";

const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME);

function convertToYAML(req, reply) {
	let body;

	try {
		const span = tracer.startSpan("parse json");
		body = JSON.parse(req.body.json);
		span.end();
	} catch (err) {
		req.log.error(err, "Parsing JSON body failed");

		return reply.status(400).send("Invalid JSON input");
	}

	const span = tracer.startSpan("convert json to yaml");
	const yaml = stringify(body);
	span.end();

	reply.send(yaml);
}

export { convertToYAML };
