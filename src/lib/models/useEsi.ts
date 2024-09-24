// import esiJS from 'esijs';
// import chalk from 'chalk';

// const esiClient = new esiJS({});

// let lastRemainingErrorsAllowed = 1000;
// let lastErrorsResetTimeRemaining = 0;

// export const useEsi = () => {
// 	const doEsiCall = async (esiFunction, ...args) => {
// 		await pause(0.1);
// 		try {
// 			// so we need to be aware of the error limit and reset time
// 			// if we are getting close to the limit, we need to pause for a bit

// 			if (lastRemainingErrorsAllowed < 5) {
// 				console.log(lastRemainingErrorsAllowed, lastErrorsResetTimeRemaining);
// 				console.log(
// 					chalk.hex('#FFA500')('[ESI:INFO]:'),
// 					'Reached error limit, pausing for',
// 					lastErrorsResetTimeRemaining + 5,
// 					'seconds'
// 				);
// 				await pause(lastErrorsResetTimeRemaining + 5);
// 			}

// 			const esiResponse = await esiFunction(...args);

// 			lastRemainingErrorsAllowed = parseInt(esiResponse.headers['x-esi-error-limit-remain']);
// 			lastErrorsResetTimeRemaining = parseInt(esiResponse.headers['x-esi-error-limit-reset']); // this is in seconds

// 			return esiResponse;
// 		} catch (error) {
// 			console.error('ESI Error:', error.message);
// 			return {};
// 		}
// 	};

// 	const getCharacterPublicData = async (eveId) => {
// 		console.log(chalk.hex('#FFA500')('[ESI:INFO]:'), 'Getting public data for character', eveId);
// 		try {
// 			const esiResponse = await doEsiCall(esiClient.character.info, parseInt(eveId));
// 			const characterData = esiResponse.data;
// 			return characterData;
// 		} catch (error) {
// 			console.error('ESI getCharacterPublicData Error:', error.message);
// 			if (error.message.includes('Character not found')) {
// 				console.error('Character not found ID =', eveId);
// 			}
// 			return {};
// 		}
// 	};

// 	const getCorporationPublicData = async (eveId) => {
// 		const esiResponse = await doEsiCall(esiClient.corporation.info, parseInt(eveId));
// 		const corpData = esiResponse.data;
// 		return corpData;
// 	};

// 	const getCharacterEmploymentHistory = async (eveId) => {
// 		console.log(
// 			chalk.hex('#FFA500')('[ESI:INFO]:'),
// 			'Getting employment history for character',
// 			eveId
// 		);
// 		const esiResponse = await doEsiCall(esiClient.character.corpHistory, parseInt(eveId));
// 		const corpHistoryData = esiResponse.data;
// 		return corpHistoryData;
// 	};

// 	const getCorpAllianceHistory = async (eveId) => {
// 		console.log(
// 			chalk.hex('#FFA500')('[ESI:INFO]:'),
// 			'Getting alliance history for corporation',
// 			eveId
// 		);
// 		const esiResponse = await doEsiCall(esiClient.corporation.allianceHistory, parseInt(eveId));
// 		const corpAllianceHistoryData = esiResponse.data;
// 		return corpAllianceHistoryData;
// 	};

// 	const getAlliancePublicData = async (eveId) => {
// 		console.log(chalk.hex('#FFA500')('[ESI:INFO]:'), 'Getting public data for alliance', eveId);
// 		const esiResponse = await doEsiCall(esiClient.alliance.info, parseInt(eveId));
// 		const allianceData = esiResponse.data;
// 		return allianceData;
// 	};

// 	const getAllianceCorpList = async (eveId) => {
// 		console.log(
// 			chalk.hex('#FFA500')('[ESI:INFO]:'),
// 			'Getting corporation list for alliance',
// 			eveId
// 		);
// 		const esiResponse = await doEsiCall(esiClient.alliance.corps, parseInt(eveId));
// 		const allianceCorpListData = esiResponse.data;
// 		return allianceCorpListData;
// 	};

// 	const getEsiNames = async (idsArray) => {
// 		// the IDs that reach this point should be filtered and ready to go
// 		// we need to bucket them into reasonable chunks and then keep track of failed calls
// 		// we return the records we got along with the IDs that failed
// 		let resolvedRecords = [];
// 		let failedIds = [];

// 		let chunkSize = 10;
// 		for (let i = 0; i < idsArray.length; i += chunkSize) {
// 			const chunk = idsArray.slice(i, i + chunkSize);
// 			console.log(
// 				chalk.hex('#FFA500')('[ESI:INFO]:'),
// 				'Getting names for chunk of size',
// 				chunk.length
// 			);
// 			try {
// 				const esiResponse = await doEsiCall(esiClient.universe.bulk.idsToNames, chunk);
// 				const esiNamesData = esiResponse.data;
// 				resolvedRecords = [...resolvedRecords, ...esiNamesData];
// 			} catch (error) {
// 				// when it fails, add the chunk to the failed IDs array
// 				if (error.message.includes('Ensure all IDs are valid before resolving')) {
// 					failedIds = [...failedIds, ...chunk];
// 				}
// 			}
// 		}

// 		return { resolvedRecords, failedIds };
// 	};

// 	const getEsiIds = async (namesArray) => {
// 		let finalIDRecords = {};
// 		// ESI returns an object where the IDs are separated into categories
// 		if (namesArray.length > 100) {
// 			let chunkSize = 100;
// 			for (let i = 0; i < namesArray.length; i += chunkSize) {
// 				const chunk = namesArray.slice(i, i + chunkSize);
// 				console.log(
// 					chalk.hex('#FFA500')('[ESI:INFO]:'),
// 					'Getting IDs for chunk of size',
// 					chunk.length
// 				);
// 				try {
// 					const esiResponse = await doEsiCall(esiClient.universe.bulk.namesToIDs, chunk);
// 					const esiIdsData = esiResponse.data;
// 					finalIDRecords = deepMerge(finalIDRecords, esiIdsData);
// 				} catch (error) {
// 					console.error(error);
// 				}
// 			}
// 		} else {
// 			try {
// 				const esiResponse = await doEsiCall(esiClient.universe.bulk.namesToIDs, namesArray);
// 				const esiIdsData = esiResponse.data;
// 				finalIDRecords = esiIdsData;
// 			} catch (error) {
// 				console.error(error);
// 			}
// 		}

// 		return finalIDRecords;
// 	};

// 	const getKillmailData = async (killmailId, killmailHash) => {
// 		console.log(chalk.hex('#FFA500')('[ESI:INFO]:'), 'Getting killmail data for', killmailId);
// 		const esiResponse = await doEsiCall(esiClient.killmails.killmailInfo, killmailId, killmailHash);
// 		const killmailData = esiResponse.data;
// 		return killmailData;
// 	};

// 	const pause = (seconds) => {
// 		return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
// 	};

// 	function isObject(obj) {
// 		return obj && typeof obj === 'object' && !Array.isArray(obj);
// 	}

// 	function deepMerge(target, source) {
// 		if (isObject(target) && isObject(source)) {
// 			for (const key in source) {
// 				if (isObject(source[key])) {
// 					if (!target[key]) {
// 						Object.assign(target, { [key]: {} });
// 					}
// 					deepMerge(target[key], source[key]);
// 				} else if (Array.isArray(source[key])) {
// 					if (!Array.isArray(target[key])) {
// 						target[key] = [];
// 					}
// 					target[key] = [...new Set([...target[key], ...source[key]])];
// 				} else {
// 					Object.assign(target, { [key]: source[key] });
// 				}
// 			}
// 		}
// 		return target;
// 	}

// 	return {
// 		getCorporationPublicData,
// 		getCharacterPublicData,
// 		getCharacterEmploymentHistory,
// 		getCorpAllianceHistory,
// 		getAlliancePublicData,
// 		getAllianceCorpList,
// 		getEsiNames,
// 		getEsiIds,
// 		getKillmailData
// 	};
// };
