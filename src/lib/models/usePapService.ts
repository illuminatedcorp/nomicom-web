import moment from 'moment';
import { toast } from 'svelte-sonner';

export const usePapService = () => {
	const getCharacterPapMetrics = async (characterIds: number[]) => {
		try {
			const url = import.meta.env.VITE_PAP_SERVICE_DOMAIN + '/paps/character?characterIds=' + JSON.stringify(characterIds);

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		} catch (error) {
			// console.error('Error getting character PAP metrics:', error);
			return null;
		}
	};

	const getCorporationPaps = async (
		corporationId: number,
		startDate: string,
		endDate: string,
		numResults: number = 5,
		allMembers: boolean = false
	) => {
		try {
			const url =
				import.meta.env.VITE_PAP_SERVICE_DOMAIN +
				'/paps/corporation?corporationId=' +
				corporationId +
				'&startDate=' +
				startDate +
				'&endDate=' +
				endDate +
				'&allMembers=' +
				allMembers +
				(numResults ? '&numResults=' + numResults : '');

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			let data = await response.json();

			return data;
		} catch (error) {
			// console.error('Error getting corporation PAP metrics:', error);
			return null;
		}
	};

	const getCorporationTopContributorPapMetrics = async (corporationId: number) => {
		try {
			// first we get the current month
			const currentMonth = moment.utc().month();

			// we want the start of the month
			const startDate = moment.utc().month(currentMonth).date(1).startOf('day');
			// and the end the of the month, which should be the start of the first day of the next month
			const endDate = moment
				.utc()
				.month(currentMonth + 1)
				.date(1)
				.startOf('day');

			const url =
				import.meta.env.VITE_PAP_SERVICE_DOMAIN +
				'/paps/corporation?corporationId=' +
				corporationId +
				'&startDate=' +
				startDate.toISOString() +
				'&endDate=' +
				endDate.toISOString() +
				'&minimumPaps=8' +
				'&numResults=10';

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		} catch (error) {
			// console.error('Error getting corporation top PAP metrics:', error);
			return null;
		}
	};

	const getCorporationEventMetrics = async (corporationId: number) => {
		try {
			// first we get the current month
			const currentMonth = moment.utc().month();

			// then we determine which week we are in
			// the way I want this to work is:
			// week 1 = 1st - 7th
			// week 2 = 8th - 14th
			// week 3 = 15th - 21st
			// week 4 = 22nd - 28th
			const week = Math.ceil(moment.utc().date() / 7) - 1;

			// then we determine the start and date
			// we want the start date to be at the beginning of day
			// and the end date to be at the end of day
			const startDate = moment
				.utc()
				.month(currentMonth)
				.date(week * 7 + 1)
				.startOf('day');
			const endDate = moment
				.utc()
				.month(currentMonth)
				.date(week * 7 + 7)
				.endOf('day');

			const url =
				import.meta.env.VITE_PAP_SERVICE_DOMAIN +
				'/paps/corporation?corporationId=' +
				corporationId +
				'&startDate=' +
				startDate.toISOString() +
				'&endDate=' +
				endDate.toISOString() +
				'&numResults=5';
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		} catch (error) {
			// console.error('Error getting corporation top PAP metrics:', error);
			return null;
		}
	};

	const getCorporationPapMetrics = async (corporationId: number, startDate: string, endDate: string) => {
		try {
			const url = import.meta.env.VITE_PAP_SERVICE_DOMAIN + '/paps/corporation/metrics?corporationId=' + corporationId;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		} catch (error) {
			// console.error('Error getting corporation PAP metrics:', error);
			return null;
		}
	};

	return {
		getCharacterPapMetrics,
		getCorporationPaps,
		getCorporationTopContributorPapMetrics,
		getCorporationEventMetrics,
		getCorporationPapMetrics
	};
};
