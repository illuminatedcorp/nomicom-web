const cache = new Map();

export const useFuzzworks = () => {
	let getAppraisal = async (itemTypeIdArray) => {
		let jitaStationId = 60003760;

		let baseUrl = 'https://market.fuzzwork.co.uk/aggregates/?';
		let finalUrl = baseUrl + `station=${jitaStationId}` + `&types=${itemTypeIdArray}`;

		if (cache.has(finalUrl)) {
			return cache.get(finalUrl);
		}

		let response = await fetch(finalUrl, {});
		let data = await response.json();
		cache.set(finalUrl, data);

		let finalData = itemTypeIdArray.map((itemTypeId) => {
			let appraisal = data[itemTypeId];
			return {
				itemTypeId: itemTypeId,
				appraisal: appraisal ? appraisal : null
			};
		});

		return finalData;
	};

	return {
		getAppraisal
	};
};
