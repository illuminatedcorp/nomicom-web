<script lang="ts">
	import { onMount } from 'svelte';

	import { useApi } from '$lib/models/useApi.js';
	const { apiCall } = useApi();

	onMount(async () => {
		// goto('/login');

		await apiCall('test');
	});
</script>

<div class="flex justify-center">
	<div
		class="flex justify-center bg-background-900 bg-opacity-70 border-2 border-background-900 rounded-md px-10 py-5 mx-24 mt-10"
	>
		<div class="flex flex-col items-center">
			<div class="text-xl text-left w-full">We are recruiting!</div>
			<div class="w-full text-left">
				Illuminated is a PVP focused corporation in Eve Online and a member of Goonswarm Federation
				based in Delve. We are looking for active PVP pilots and industrialists to join our ranks.
				If you are interested in joining, please join our Discord server and ask for a recruiter.
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
</div>
