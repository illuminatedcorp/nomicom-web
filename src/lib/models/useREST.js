import axios from 'axios';
import { API_ROUTES } from '$lib/models/useConstants.js';

const ROUTES = {
	[API_ROUTES.example]: () => '/example'
};

export const useREST = () => {
	const doQuery = async (apiRoute, params) => {
		try {
			let route = ROUTES[apiRoute] ? ROUTES[apiRoute](params) : apiRoute;
			console.log(params);

			const response = await axios.post(process.env.API_DOMAIN + '/api' + route, params, {
				timeout: 0, // Disable timeout on the client side
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive' // Ensure connection is kept alive
				}
			});

			const data = response.data;

			if (data.error) {
				return null;
			} else {
				return data;
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	return {
		doQuery
	};
};
