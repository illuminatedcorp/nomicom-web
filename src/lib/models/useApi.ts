import { goto } from '$app/navigation';
import { base } from '$app/paths';
import axios from 'axios';
import { API_ROUTES, WEB_ROUTES } from './useConstants';

export const useApi = () => {
	// so the idea here is that we simple forward all API requests, their route labels, and params to the sveltkit server
	const apiCall = async (apiRoute, params) => {
		// first up we need to get the api token from local storage
		const token = await localStorage.getItem('api_token');

		try {
			let response;

			if (apiRoute.method === 'GET') {
				// for get data is sent via query params
				response = await axios.get(import.meta.env.VITE_SERVER_HOST + '/api/v1' + apiRoute.route, {
					params,
					headers: {
						'Content-Type': 'application/json',
						Authorization: token ? `Bearer ${token}` : undefined
					},
					withCredentials: true // Include cookies with the request
				});
			} else if (apiRoute.method === 'POST') {
				if (apiRoute.route === API_ROUTES.login.route) {
					response = await axios.post(
						import.meta.env.VITE_SERVER_HOST + '/api/v1' + apiRoute.route,
						null,
						{
							params,
							headers: {
								'Content-Type': 'application/json',
								Authorization: token ? `Bearer ${token}` : undefined
							},
							withCredentials: true // Include cookies with the request
						}
					);
				} else {
					// for a post we send the data via body
					response = await axios.post(
						import.meta.env.VITE_SERVER_HOST + '/api/v1' + apiRoute.route,
						params,
						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: token ? `Bearer ${token}` : undefined
							},
							withCredentials: true // Include cookies with the request
						}
					);
				}
			} else if (apiRoute.method === 'PUT' || apiRoute.method === 'DELETE') {
				// for a put we send the data via body
				// but there is probably an ID we need to include in the route
				let url = import.meta.env.VITE_SERVER_HOST + '/api/v1' + apiRoute.route;

				// if there is an ID in the route we need to replace it with the ID from the params
				if (apiRoute.route.includes(':id')) {
					url = url.replace(':id', params.id);
				}

				response = await axios.put(url, params, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: token ? `Bearer ${token}` : undefined
					},
					withCredentials: true // Include cookies with the request
				});
			} else {
				console.error('What on earth are you doing? Tried to make a', apiRoute.method, 'request??');
			}

			const data = response.data;

			if (data.error) {
				console.error(data.error);
				return null;
			} else {
				return data;
			}
		} catch (error) {
			if (error.status === 401) {
				// we want to redirect to login if we get a 401 and are on a route that starts with /nomicon
				// if (window.location.pathname.startsWith(WEB_ROUTES.nomicon)) {
				// 	goto(`${base}${WEB_ROUTES.login}`);
				// }
			}
			return null;
		}
	};

	return {
		apiCall
	};
};
