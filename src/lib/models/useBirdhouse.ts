export const useBirdhouse = () => {
	const getCharacterPapMetrics = async (characterId: number) => {
		const url = import.meta.env.VITE_BIRDHOUSE_DOMAIN + '/paps?characterId=' + characterId;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.json();
	};

	return {
		getCharacterPapMetrics
	};
};
