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
					timeout: 0,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

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
		apiGet
	};
};
