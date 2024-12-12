import Fastify from "fastify";

import fastifyCompress from "@fastify/compress";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyHelmet from "@fastify/helmet";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import logger from "../config/logger.js";
import routes from "./routes/routes.js";

const fastifyApp = Fastify({
	loggerInstance: logger.child({ service: "converter-service" }),
});

await fastifyApp.register(fastifyCors);
await fastifyApp.register(fastifyHelmet);
await fastifyApp.register(fastifyCompress);
await fastifyApp.register(fastifyGracefulShutdown);
await fastifyApp.register(fastifyFormbody);
await fastifyApp.register(routes);

export default fastifyApp;
