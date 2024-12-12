import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const User = sequelize.define(
	"User",
	{
		email: {
			type: DataTypes.STRING,
			unique: true,
			trim: true,
			allowNull: false,
			validate: {
				isEmail: true,
			},
		},
		fullname: {
			type: DataTypes.STRING,
			trim: true,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
	},
	{
		tableName: "users",
	},
);

export default User;
