// import dotenv from 'dotenv';
// dotenv.config();

// import { json } from '@sveltejs/kit';

// import { usePrices } from '$lib/models/usePrices.ts';
// const { getItemPrices } = usePrices();

// import { useDatabase } from '$lib/models/useDatabase.ts';
// const { setup, getBuybackRequests, getAllBuybackRequests, saveBuybackRequest } = useDatabase();
// setup();

// import { useAuth } from '$lib/models/useAuth.js';
// import { API_ROUTES } from '$lib/models/useConstants.ts';
// const { login, authenticateSession } = useAuth();

// export async function POST({ request }) {
// 	try {
// 		// the session ID comes from the cookie
// 		const cookies = request.headers.get('cookie');
// 		const sessionId = cookies
// 			?.split('; ') // Split cookies into an array
// 			.find((cookie) => cookie.startsWith('sessionId=')) // Find the sessionId cookie
// 			?.split('=')[1]; // Get the value part of the sessionId cookie

// 		const { apiRoute, params } = await request.json();
// 		console.log('apiRoute', apiRoute);
// 		console.log('params', params);
// 		console.log('sessionId', sessionId);

// 		// if this is an API call to login, we go ahead and log them in
// 		if (apiRoute === 'login') {
// 			// this call auths them against ESI and gets their info from the database
// 			// if there the user didn't exist, it creates a new user and a new session
// 			let sessionData = await login(params);

// 			const response = json({
// 				status: 'ok',
// 				message: 'Login successful',
// 				id: sessionData.id,
// 				name: sessionData.name
// 			});

// 			// cookie is set to timeout after a week
// 			response.headers.set(
// 				'set-cookie',
// 				`sessionId=${sessionData.sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
// 			);

// 			return response;
// 		}

// 		if (!sessionId) {
// 			return new Response('Unauthorized', { status: 401 });
// 		}

// 		const userData = await authenticateSession(sessionId);

// 		if (!userData) {
// 			return new Response('Unauthorized', { status: 401 });
// 		}

// 		console.log('AUTHED userData', userData);

// 		if (apiRoute === API_ROUTES.getSession) {
// 			if (!sessionId) {
// 				return new Response('Unauthorized', { status: 401 });
// 			}

// 			const userData = await authenticateSession(sessionId);

// 			if (!userData) {
// 				return new Response('Unauthorized', { status: 401 });
// 			}

// 			return json(userData);
// 		}

// 		switch (apiRoute) {
// 			case API_ROUTES.buybacksByUser: {
// 				let data = await getBuybackRequests(userData.id);
// 				return json(data);
// 			}
// 			case API_ROUTES.getAppraisal: {
// 				let data = await getItemPrices(params);
// 				return json(data);
// 			}
// 			case API_ROUTES.saveBuyback: {
// 				await saveBuybackRequest(params);
// 				break;
// 			}
// 			case API_ROUTES.allBuybacks: {
// 				// for this one we want to make sure they are an admin
// 				if (userData.admin) {
// 					let data = await getAllBuybackRequests();
// 					return json(data);
// 				}
// 				break;
// 			}
// 			default:
// 		}

// 		// just return a 200 for now
// 		return json({ status: 'ok' });
// 	} catch (error) {
// 		console.error(error);

// 		return json({ error: error.message });
// 	}
// }
