import { Sequelize } from "sequelize";
import env from "../../config/env.js";
import logger from "../../config/logger.js";

const { user, password, db, db_dev, host } = env.postgres;

const database = env.node_env === "development" ? db_dev : db;

const sequelize = new Sequelize(database, user, password, {
	host,
	dialect: "postgres",
	logging: (msg) => logger.debug(msg),
});

export default sequelize;
