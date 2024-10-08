import moment from 'moment';
import { toast } from 'svelte-sonner';

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

	const getCorporationTopPapMetrics = async (corporationId: number) => {
		try {
			// first we get the current month
			const currentMonth = moment.utc().month();

			// then we determine which week we are in
			// the way I want this to work is:
			// week 1 = 1st - 7th
			// week 2 = 8th - 14th
			// week 3 = 15th - 21st
			// week 4 = 22nd - 28th
			const week = Math.floor(moment.utc().date() / 7) - 1;

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
				endDate.toISOString();

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		} catch (error) {
			console.error('Error getting corporation top PAP metrics:', error);
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
			console.error('Error getting wiki index:', error);
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
			console.error('Error getting wiki page:', error);
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
				toast.error('Error saving wiki page. Please try again.');
				return null;
			}
		} catch (error) {
			console.error('Error saving wiki page:', error);
			return null;
		}
	};

	return {
		getCharacterPapMetrics,
		getCorporationTopPapMetrics,
		getWikiIndex,
		getWikiPage,
		saveWikiPage
	};
};
