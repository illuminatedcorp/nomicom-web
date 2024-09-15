import { goto } from '$app/navigation';
import axios from 'axios';

export const useApi = () => {
	// so the idea here is that we simple forward all API requests, their route labels, and params to the sveltkit server
	const apiGet = async (apiRoute, params) => {
		try {
			const response = await axios.post(
				'/api',
				{
					apiRoute,
					params
				},
				{
					headers: {
						'Content-Type': 'application/json'
					},
					withCredentials: true // Include cookies with the request
				}
			);

			const data = response.data;

			if (data.error) {
				return null;
			} else {
				return data;
			}
		} catch (error) {
			if (error.status === 401) {
				// Unauthorized
				goto('/login');
			}
			return null;
		}
	};

	return {
		apiGet
	};
};
