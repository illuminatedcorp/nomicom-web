import { goto } from '$app/navigation';
import { base } from '$app/paths';
import axios from 'axios';
import { API_ROUTES, WEB_ROUTES } from './useConstants';

export const useApi = () => {
	// so the idea here is that we simple forward all API requests, their route labels, and params to the sveltkit server
	const apiCall = async (apiRoute, params) => {
		try {
			let response;

			if (apiRoute.method === 'GET') {
				// for get data is sent via query params
				response = await axios.get(import.meta.env.VITE_SERVER_HOST + '/api/v1' + apiRoute, {
					params,
					headers: {
						'Content-Type': 'application/json'
					},
					withCredentials: true // Include cookies with the request
				});
			} else if (apiRoute.method === 'POST') {
				// for a post we send the data via body
				response = await axios.post(
					import.meta.env.VITE_SERVER_HOST + '/api/v1' + apiRoute,
					params,
					{
						headers: {
							'Content-Type': 'application/json'
						},
						withCredentials: true // Include cookies with the request
					}
				);
			} else {
				console.error('What on earth are you doing? Tried to make a', apiRoute.method, 'request??');
			}

			// if (apiRoute === API_ROUTES.login) {
			// 	response = await axios.post(import.meta.env.VITE_SERVER_HOST + '/api/v1' + apiRoute, null, {
			// 		params,
			// 		headers: {
			// 			'Content-Type': 'application/json'
			// 		},
			// 		withCredentials: true // Include cookies with the request
			// 	});
			// } else {
			// 	response = await axios.post(
			// 		import.meta.env.VITE_SERVER_HOST + '/api/v1' + apiRoute,
			// 		params,
			// 		{
			// 			headers: {
			// 				'Content-Type': 'application/json'
			// 			},
			// 			withCredentials: true // Include cookies with the request
			// 		}
			// 	);
			// }

			const data = response.data;

			if (data.error) {
				console.error(data.error);
				return null;
			} else {
				return data;
			}
		} catch (error) {
			if (error.status === 401) {
				// Unauthorized
				goto(`${base}${WEB_ROUTES.login}`);
			}
			return null;
		}
	};

	return {
		apiCall
	};
};
