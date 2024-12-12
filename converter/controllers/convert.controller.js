import { stringify } from "yaml";

function convertToYAML(req, reply) {
	let body;

	try {
		body = JSON.parse(req.body.json);
	} catch (err) {
		req.log.error(err, "Parsing JSON body failed");

		return reply.status(400).send("Invalid JSON input");
	}

	const yaml = stringify(body);

	reply.send(yaml);
}

export { convertToYAML };
