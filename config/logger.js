import pino from "pino";
import env from "./env.js";

const logger = pino({
	level: env.logLevel,
	formatters: {
		bindings: (bindings) => {
			return { pid: bindings.pid, host: bindings.hostname };
		},

		level: (label) => {
			return { level: label };
		},
	},
	timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
