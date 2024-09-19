import { goto } from '$app/navigation';
import { base } from '$app/paths';
import axios from 'axios';

export const useApi = () => {
	// so the idea here is that we simple forward all API requests, their route labels, and params to the sveltkit server
	const apiCall = async (apiRoute, params) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_HOST + '/api/v1/' + apiRoute,
				params,
				{
					headers: {
						'Content-Type': 'application/json'
					},
					withCredentials: true // Include cookies with the request
				}
			);

			// for dev we just want to mock a response and print the request
			// console.log('API CALL:', apiRoute, params);
			// const response = {
			// 	data: {
			// 		error: undefined,
			// 		status: 200
			// 	}
			// };

			const data = response.data;

			if (data.error) {
				return null;
			} else {
				return data;
			}
		} catch (error) {
			if (error.status === 401) {
				// Unauthorized
				goto(`${base}/login`);
			}
			return null;
		}
	};

	return {
		apiCall
	};
};
