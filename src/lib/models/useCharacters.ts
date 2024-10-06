import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { base } from '$app/paths';

import { WEB_ROUTES } from '$lib/models/useConstants';

import { userStore } from '@/stores/userStore';

// import { useEsi } from './useEsi';
// const { getCharacterPublicData } = useEsi();

export const useCharacters = () => {
	const getMainCharacter = (user) => {
		let mainCharacter = user.characters.find((character) => {
			return character.main;
		});
		return mainCharacter;
	};

	const redirectToAddCharacter = () => {
		let redirectUri = encodeURIComponent(
			import.meta.env.VITE_WEB_HOST + base + WEB_ROUTES.loginRedirect
		);
		let clientId = import.meta.env.VITE_EVE_APP_CLIENT_ID;
		let uuidState = 'addCharacter_' + uuidv4();
		let scopes =
			'publicData esi-calendar.read_calendar_events.v1 esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-mail.read_mail.v1 esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-wallet.read_character_wallet.v1 esi-wallet.read_corporation_wallet.v1 esi-search.search_structures.v1 esi-clones.read_clones.v1 esi-characters.read_contacts.v1 esi-universe.read_structures.v1 esi-bookmarks.read_character_bookmarks.v1 esi-killmails.read_killmails.v1 esi-corporations.read_corporation_membership.v1 esi-assets.read_assets.v1 esi-planets.manage_planets.v1 esi-fleets.read_fleet.v1 esi-fittings.read_fittings.v1 esi-markets.structure_markets.v1 esi-corporations.read_structures.v1 esi-characters.read_loyalty.v1 esi-characters.read_opportunities.v1 esi-characters.read_chat_channels.v1 esi-characters.read_medals.v1 esi-characters.read_standings.v1 esi-characters.read_agents_research.v1 esi-industry.read_character_jobs.v1 esi-markets.read_character_orders.v1 esi-characters.read_blueprints.v1 esi-characters.read_corporation_roles.v1 esi-location.read_online.v1 esi-contracts.read_character_contracts.v1 esi-clones.read_implants.v1 esi-characters.read_fatigue.v1 esi-killmails.read_corporation_killmails.v1 esi-corporations.track_members.v1 esi-wallet.read_corporation_wallets.v1 esi-characters.read_notifications.v1 esi-corporations.read_divisions.v1 esi-corporations.read_contacts.v1 esi-assets.read_corporation_assets.v1 esi-corporations.read_titles.v1 esi-corporations.read_blueprints.v1 esi-bookmarks.read_corporation_bookmarks.v1 esi-contracts.read_corporation_contracts.v1 esi-corporations.read_standings.v1 esi-corporations.read_starbases.v1 esi-industry.read_corporation_jobs.v1 esi-markets.read_corporation_orders.v1 esi-corporations.read_container_logs.v1 esi-industry.read_character_mining.v1 esi-industry.read_corporation_mining.v1 esi-planets.read_customs_offices.v1 esi-corporations.read_facilities.v1 esi-corporations.read_medals.v1 esi-characters.read_titles.v1 esi-alliances.read_contacts.v1 esi-characters.read_fw_stats.v1 esi-corporations.read_fw_stats.v1 esi-characterstats.read.v1';
		let loginUrl = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&state=${uuidState}&scope=${scopes}`;

		localStorage.setItem('state', uuidState);

		window.location.href = loginUrl;
	};

	// const populateCharacterData = async (characters) => {
	// 	let newCharacters = [];
	// 	for (let character of characters) {
	// 		let newCharacter = await getCharacterPublicData(character.eve_id);
	// 		newCharacters.push(newCharacter);
	// 	}
	// };

	return {
		getMainCharacter,
		redirectToAddCharacter
		// populateCharacterData
	};
};
