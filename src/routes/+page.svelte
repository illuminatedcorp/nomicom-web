<script>
	import { onMount } from 'svelte';

	import { useApi } from '$lib/models/useApi.js';
	const { apiGet } = useApi();

	onMount(async () => {
		// goto('/login');

		await apiGet('test');
	});
</script>

<div class="flex items-center justify-center w-full h-full">
	<div class="flex flex-col items-center max-w-96">
		<div class="text-5xl">Illuminated</div>
		<div class="text-sm mt-1">An EVE Online Corporation | Goonswarm Federation</div>

		<div class="flex gap-3 mt-8">
			<a
				href="https://discord.gg/illuminated"
				class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 px-8 rounded"
			>
				Discord
			</a>
			<a
				href="https://wiki.illuminatedcorp.com/"
				class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 px-8 rounded"
			>
				Wiki
			</a>
			<a
				href="https://auth.illuminatedcorp.com/"
				class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 px-8 rounded"
			>
				Auth
			</a>
			<a
				href="https://zkillboard.com/corporation/98718341/"
				class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 px-8 rounded"
			>
				Killboard
			</a>
			<a
				href="/buyback"
				class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 px-8 rounded"
			>
				Buyback
			</a>
		</div>

		<div class="text-xl text-left w-full mt-10">We are recruiting!</div>
		<div class="w-full text-left">
			Illuminated is a PVP focused corporation in Eve Online and a member of Goonswarm Federation
			based in Delve. We are looking for active PVP pilots and industrialists to join our ranks. If
			you are interested in joining, please join our Discord server and ask for a recruiter.
		</div>

		<div class="text-xl text-left w-full mt-5">We will likely be a good fit if:</div>
		<ul class="w-full text-left">
			<li>You enjoy PVP</li>
			<li>You are an active player</li>
			<li>You've heard about Goonswarm's SIGs and want in</li>
			<li>Want to be apart of one of the greatest stories in Eve</li>
		</ul>

		<div class="text-xl text-left w-full mt-5">What we have to offer:</div>
		<ul class="w-full text-left">
			<li>Corp PVP fleets</li>
			<li>Access to massive industrial infrastructure</li>
			<li>Active comms</li>
			<li>Experienced leadership</li>
		</ul>
	</div>
</div>
