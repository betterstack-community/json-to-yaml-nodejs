import { convertToYAML } from "../controllers/convert.controller.js";

export default async function fastifyRoutes(fastify) {
	fastify.post("/convert-yaml", convertToYAML);

	fastify.get("/health", (req, reply) => {
		reply.send({ status: "ok" });
	});
}
