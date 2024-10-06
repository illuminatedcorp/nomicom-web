export const useBirdhouse = () => {
	const getCharacterPapMetrics = async (characterId: number) => {
		try {
			const url = import.meta.env.VITE_BIRDHOUSE_DOMAIN + '/paps?characterId=' + characterId;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		} catch (error) {
			console.error('Error getting character PAP metrics:', error);
			return null;
		}
	};

	return {
		getCharacterPapMetrics
	};
};
