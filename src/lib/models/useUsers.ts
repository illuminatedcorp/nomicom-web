export const useUsers = () => {
	const setup = async () => {
		console.log('trying to setup user stuff');

		// const user = await getUserDataByToken();
		// return user;
	};

	// const getUserDataByToken = async (id) => {
	// 	try {
	// 		const response = await fetch(`/api/v1/users/${id}`);
	// 		const data = await response.json();
	// 		if (data.error) {
	// 			console.error(data.error);
	// 			return null;
	// 		} else {
	// 			return data;
	// 		}
	// 	} catch (error) {
	// 		console.error(error);
	// 		return null;
	// 	}
	// };

	return {
		setup
		// getUserDataByToken
	};
};
