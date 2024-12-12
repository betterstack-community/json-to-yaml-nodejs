import env from "./env.js";

const { user, password, db, host } = env.postgres;

export default {
	development: {
		username: user,
		password: password,
		database: db,
		host: host,
		dialect: "postgres",
	},
	production: {
		username: user,
		password: password,
		database: db,
		host: host,
		dialect: "postgres",
	},
};
