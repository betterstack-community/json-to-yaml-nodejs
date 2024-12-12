import "../otel.js";
import process from "node:process";
import env from "../config/env.js";
import logger from "../config/logger.js";
import app from "./app.js";

function exit() {
	if (app.server) {
		app.server.close(() => {
			logger.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
}

function handleError(error) {
	logger.fatal(error);
	exit();
}

try {
	const address = app.listen({
		host: "0.0.0.0",
		port: env.converter.port,
	});

	logger.info(
		`Converter service is running in ${env.nodeEnv} mode → PORT ${address}`,
	);

	process.on("SIGTERM", () => {
		logger.info("SIGTERM received. Executing shutdown sequence");
		exit();
	});

	process.on("uncaughtException", handleError);
	process.on("unhandledRejection", handleError);
} catch (err) {
	logger.fatal(err);
	exit();
}
