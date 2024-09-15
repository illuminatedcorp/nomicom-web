import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { useBirdhouse } from './useBirdhouse';
const { saveUser, getUserData, getUserDataBySessionId } = useBirdhouse();

export const useAuth = () => {
	const login = async ({ code, state }) => {
		let token = await getToken(code);

		if (token) {
			// we want to decode the token and get the user info
			let { access_token, refresh_token } = token;
			let decoded = jwt.decode(access_token);

			let name = decoded.name;
			let id = decoded.sub.split(':')[2];
			let sessionId = null;

			// first we want to try and get the user from the database
			let user = await getUserData(id);
			if (user) {
				// if the user exists, we want to grab the stored session ID
				sessionId = user.sessionId;

				if (!sessionId) {
					sessionId = uuidv4();
					await saveUser({ id, name, access_token, refresh_token, sessionId });
				}

				// then we return the session info
				let sessionInfo = {
					name,
					id,
					sessionId
				};

				return sessionInfo;
			}

			// if the user doesn't exist, we want to create a new user and session
			if (!sessionId) {
				sessionId = uuidv4();
				// we want to save the session ID to the database
				await saveUser({ id, name, access_token, refresh_token, sessionId });
			}

			let sessionInfo = {
				name,
				id,
				sessionId
			};

			return sessionInfo;
		} else {
			return null;
		}
	};

	const getToken = async (code) => {
		const response = await fetch(
			'https://login.eveonline.com/v2/oauth/token?' + `grant_type=authorization_code&code=${code}`,
			{
				method: 'POST',
				headers: {
					Authorization:
						'Basic ' + btoa(`${process.env.EVE_APP_CLIENT_ID}:${process.env.EVE_APP_SECRET_KEY}`),
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `grant_type=authorization_code&code=${code}`
			}
		);

		try {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			let data = await response.json();
			return data;
		} catch (error) {
			console.error('There has been a problem with your fetch operation:', error);
			return null;
		}
	};

	const authenticateSession = async (sessionId) => {
		console.log('sessionId', sessionId);
		if (!sessionId) {
			return null; // Unauthorized
		}

		// we want to first get the user info from the database
		let user = await getUserDataBySessionId(sessionId);

		if (!user) {
			return null; // Forbidden
		}

		// if everything checks out, we return
		let data = user.rows[0];
		return data;
	};

	return {
		login,
		getToken,
		authenticateSession
	};
};
