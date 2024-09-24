<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { base } from '$app/paths';

	import Button from '$lib/components/ui/button/button.svelte';

	import { WEB_ROUTES } from '$lib/models/useConstants';

	let redirectUri = encodeURIComponent(
		import.meta.env.VITE_WEB_HOST + base + WEB_ROUTES.loginRedirect
	);
	let clientId = import.meta.env.VITE_EVE_APP_CLIENT_ID;
	let uuidState = uuidv4();
	let scopes =
		'publicData esi-calendar.read_calendar_events.v1 esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-mail.read_mail.v1 esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-wallet.read_character_wallet.v1 esi-wallet.read_corporation_wallet.v1 esi-search.search_structures.v1 esi-clones.read_clones.v1 esi-characters.read_contacts.v1 esi-universe.read_structures.v1 esi-bookmarks.read_character_bookmarks.v1 esi-killmails.read_killmails.v1 esi-corporations.read_corporation_membership.v1 esi-assets.read_assets.v1 esi-planets.manage_planets.v1 esi-fleets.read_fleet.v1 esi-fittings.read_fittings.v1 esi-markets.structure_markets.v1 esi-corporations.read_structures.v1 esi-characters.read_loyalty.v1 esi-characters.read_opportunities.v1 esi-characters.read_chat_channels.v1 esi-characters.read_medals.v1 esi-characters.read_standings.v1 esi-characters.read_agents_research.v1 esi-industry.read_character_jobs.v1 esi-markets.read_character_orders.v1 esi-characters.read_blueprints.v1 esi-characters.read_corporation_roles.v1 esi-location.read_online.v1 esi-contracts.read_character_contracts.v1 esi-clones.read_implants.v1 esi-characters.read_fatigue.v1 esi-killmails.read_corporation_killmails.v1 esi-corporations.track_members.v1 esi-wallet.read_corporation_wallets.v1 esi-characters.read_notifications.v1 esi-corporations.read_divisions.v1 esi-corporations.read_contacts.v1 esi-assets.read_corporation_assets.v1 esi-corporations.read_titles.v1 esi-corporations.read_blueprints.v1 esi-bookmarks.read_corporation_bookmarks.v1 esi-contracts.read_corporation_contracts.v1 esi-corporations.read_standings.v1 esi-corporations.read_starbases.v1 esi-industry.read_corporation_jobs.v1 esi-markets.read_corporation_orders.v1 esi-corporations.read_container_logs.v1 esi-industry.read_character_mining.v1 esi-industry.read_corporation_mining.v1 esi-planets.read_customs_offices.v1 esi-corporations.read_facilities.v1 esi-corporations.read_medals.v1 esi-characters.read_titles.v1 esi-alliances.read_contacts.v1 esi-characters.read_fw_stats.v1 esi-corporations.read_fw_stats.v1 esi-characterstats.read.v1';
	let loginUrl = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&state=${uuidState}&scope=${scopes}`;

	const onLogin = () => {
		localStorage.setItem('state', uuidState);
		window.location.href = loginUrl;
	};
</script>

<div class="flex justify-center lg:items-center max-lg:mt-10 lg:h-full w-full h-fit">
	<div class="relative mx-3">
		<div class="background-border"></div>

		<div class="flex flex-col text-center relative px-10 py-10 z-10">
			<div>Please log in with an EVE Online character that is associated with your account.</div>

			<Button on:click={onLogin} class="mt-5 bg-transparent hover:bg-transparent">
				<img
					src="https://web.ccpgamescdn.com/eveonlineassets/developers/eve-sso-login-white-large.png"
					alt="EVE SSO Login"
				/>
			</Button>
		</div>
	</div>
</div>

<style>
	.background-border {
		position: absolute; /* Ensure the base element is positioned relative to the pseudo-element */
		inset: 0;
		z-index: 1; /* Ensure the base element and its border appear above the background */
		border-width: 30px; /* Adjust the width to match the size of your border */
		border-style: solid; /* A solid border to support the image */
		border-image: url('/images/card_border.png') 40 round;
		filter: brightness(2) sepia(1) hue-rotate(0deg) saturate(0.5);
	}

	.background-border::before {
		content: '';
		position: absolute;
		inset: -16px; /* Optional: Adjust this value to control how far the background extends */
		z-index: 0; /* Ensure the background is behind the border */
		background: var(--color-background-800); /* Background color or image */
		opacity: 0.5;
		filter: brightness(0.2);
	}
</style>
