import Fastify from "fastify";

import path from "node:path";
import fastifyCompress from "@fastify/compress";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyHelmet from "@fastify/helmet";
import fastifyReplyFrom from "@fastify/reply-from";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import pug from "pug";
import env from "../config/env.js";
import logger from "../config/logger.js";
import routes from "./routes/routes.js";

const fastifyApp = Fastify({
	loggerInstance: logger.child({ service: "auth-service" }),
});

await fastifyApp.register(fastifyCors);
await fastifyApp.register(fastifyHelmet);
await fastifyApp.register(fastifyCompress);
await fastifyApp.register(fastifyGracefulShutdown);
await fastifyApp.register(fastifyView, {
	engine: {
		pug,
	},
	root: path.join(import.meta.dirname, "views"),
	propertyName: "render",
	viewExt: "pug",
});
await fastifyApp.register(fastifyStatic, {
	root: path.join(import.meta.dirname, "public"),
	prefix: "/static/",
});
await fastifyApp.register(fastifyCookie, {
	hook: "onRequest",
});
await fastifyApp.register(fastifyReplyFrom, {
	base: `http://${env.converter.host}:${env.converter.port}`,
	contentTypesToEncode: ["application/x-www-form-urlencoded"],
});
await fastifyApp.register(fastifyFormbody);
await fastifyApp.register(routes);

export default fastifyApp;
