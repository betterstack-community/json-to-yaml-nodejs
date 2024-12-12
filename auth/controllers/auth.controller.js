import env from "../../config/env.js";
import User from "../db/models/user.model.js";
import redisConn from "../redis.js";

async function exchangeCodeForToken(endpoint) {
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			Accept: "application/json",
		},
	});

	// Check if the request was successful
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	// Parse the response as JSON
	const oauthResponse = await response.json();

	return oauthResponse;
}

async function getGitHubUserProfile(accessToken) {
	const endpoint = "https://api.github.com/user";

	const response = await fetch(endpoint, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `token ${accessToken}`,
		},
	});

	// Check if the response was successful
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	// Parse the response as JSON
	const userProfile = await response.json();

	return userProfile;
}

async function redirectToGitHub(req, reply) {
	const stateToken = await redisConn.createAuthToken();
	const endpoint = `https://github.com/login/oauth/authorize?client_id=${env.github.client_id}&redirect_uri=${env.github.redirect_uri}&scope=user&state=${stateToken}`;

	req.log.debug("Redirecting to GitHub Auth");

	reply.redirect(endpoint, 303);
}

async function completeGithubAuth(req, reply) {
	const { code, state } = req.query;

	await redisConn.verifyAndDelToken(state);

	const endpoint = `https://github.com/login/oauth/access_token?client_id=${env.github.client_id}&client_secret=${env.github.client_secret}&code=${code}&redirect_uri=${env.github.redirect_uri}`;
	const tokenResponse = await exchangeCodeForToken(endpoint);

	const userProfile = await getGitHubUserProfile(tokenResponse.access_token);

	const [user] = await User.findOrCreate({
		where: {
			email: userProfile.email,
		},
		defaults: {
			fullname: userProfile.name,
		},
	});

	const sessionToken = await redisConn.createSessionToken(user.email);

	reply
		.setCookie("sessionCookieKey", sessionToken, {
			path: "/",
			maxAge: 86400,
			httpOnly: true,
			sameSite: "strict",
		})
		.redirect("/");
}

export { redirectToGitHub, completeGithubAuth };
