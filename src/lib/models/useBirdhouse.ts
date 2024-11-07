import moment from 'moment';
import { toast } from 'svelte-sonner';

export const useBirdhouse = () => {
	const getCharacterPapMetrics = async (characterIds: number[]) => {
		try {
			const url = import.meta.env.VITE_BIRDHOUSE_DOMAIN + '/paps?characterIds=' + JSON.stringify(characterIds);

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

	const getCorporationPapMetrics = async (
		corporationId: number,
		startDate: string,
		endDate: string,
		numResults: number = 5,
		allMembers: boolean = false
	) => {
		try {
			const url =
				import.meta.env.VITE_BIRDHOUSE_DOMAIN +
				'/topPaps?corporationId=' +
				corporationId +
				'&startDate=' +
				startDate +
				'&endDate=' +
				endDate +
				'&allMembers=' +
				allMembers +
				'&numResults=' +
				(numResults ? numResults : 5);

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			let data = await response.json();
			console.log(data);

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
				import.meta.env.VITE_BIRDHOUSE_DOMAIN +
				'/topPaps?corporationId=' +
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
				import.meta.env.VITE_BIRDHOUSE_DOMAIN +
				'/topPaps?corporationId=' +
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

	const getWikiIndex = async () => {
		try {
			const url = import.meta.env.VITE_BIRDHOUSE_DOMAIN + '/wiki/index';

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		} catch (error) {
			// console.error('Error getting wiki index:', error);
			return null;
		}
	};

	const getWikiPage = async (slug: string) => {
		try {
			const url = import.meta.env.VITE_BIRDHOUSE_DOMAIN + '/wiki/page/' + slug;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		} catch (error) {
			// console.error('Error getting wiki page:', error);
			return null;
		}
	};

	const saveWikiPage = async (pageData) => {
		try {
			const url = import.meta.env.VITE_BIRDHOUSE_DOMAIN + '/wiki/page';

			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: pageData.id,
					slug: pageData.slug,
					title: pageData.title,
					content: pageData.content,
					status: pageData.status
				})
			});

			if (response.status === 200) {
				const data = await response.json();
				return data;
			} else {
				// toast.error('Error saving wiki page. Please try again.');
				return null;
			}
		} catch (error) {
			// console.error('Error saving wiki page:', error);
			return null;
		}
	};

	return {
		getCharacterPapMetrics,
		getCorporationPapMetrics,
		getCorporationTopContributorPapMetrics,
		getCorporationEventMetrics,
		getWikiIndex,
		getWikiPage,
		saveWikiPage
	};
};
