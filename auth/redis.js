import crypto from "node:crypto";
import { createClient } from "redis";
import env from "../config/env.js";

const sessionKeyPrefix = "session:";
const authTokenPrefix = "authToken:";

class RedisConn {
	client;

	async connect() {
		const client = await createClient({
			url: `redis://${env.redisAddr}`,
		}).connect();
		this.client = client;
	}

	static generateCryptoToken() {
		return crypto.randomBytes(16).toString("hex");
	}

	// Create an authentication token
	async createAuthToken() {
		const authToken = RedisConn.generateCryptoToken();

		const key = authTokenPrefix + authToken;
		const expiry = 60 * 60; // 60 minutes in seconds

		await this.client.set(key, "0", {
			EX: expiry,
		});

		return authToken;
	}

	// Verify and delete token after authentication
	async verifyAndDelToken(token) {
		const key = authTokenPrefix + token;

		const result = await this.client.get(key);
		if (result === null) {
			throw new Error("Token not found or already expired");
		}

		// Delete token after verification
		await this.client.del(key);
	}

	async createSessionToken(email) {
		const token = RedisConn.generateCryptoToken();
		const key = sessionKeyPrefix + token;
		const expiry = 24 * 60 * 60; // 24 hours in seconds

		await this.client.set(key, email, {
			EX: expiry,
		});

		return token;
	}

	async getSessionToken(token) {
		const key = sessionKeyPrefix + token;

		const email = await this.client.get(key);
		if (email === null) {
			throw new Error("Session token not found");
		}

		return email;
	}

	async deleteSessionToken(token) {
		const sessToken = sessionKeyPrefix + token;

		await this.client.del(sessToken);
	}
}

const redisConn = new RedisConn();

export default redisConn;
