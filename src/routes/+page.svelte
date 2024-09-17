<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	import { useApi } from '$lib/models/useApi.js';
	import Button from '@/components/ui/button/button.svelte';
	const { apiCall } = useApi();

	onMount(async () => {
		// goto('/login');

		await apiCall('test');
	});
</script>

<div class="flex flex-col items-center">
	<div
		class="flex flex-col justify-center bg-background-900 bg-opacity-80 border-2 border-background-900 rounded-md px-10 py-5 mt-10"
	>
		<div class="flex flex-col items-center">
			<div class="text-center">
				Illuminated is a PVP focused corporation in Eve Online and a member of Goonswarm Federation
				based in Delve.
				<br />
				We are looking for active PVP pilots and industrialists to join our ranks.
			</div>
		</div>
	</div>

	<div
		class="flex flex-col justify-center bg-background-900 bg-opacity-80 border-2 border-background-900 rounded-md px-10 py-5 mt-5 w-2/5 min-w-fit"
	>
		<div class="text-2xl text-center">You will do well with us if:</div>
		<div class="mt-3">You enjoy PVP</div>
		<div>You are an active player</div>
		<div>You've heard about Goonswarm's SIGs and want in</div>
		<div>Want to be apart of one of the greatest stories in Eve</div>
	</div>

	<div
		class="flex flex-col justify-center bg-background-900 bg-opacity-80 border-2 border-background-900 rounded-md px-10 py-5 mt-5 w-1/4 min-w-fit"
	>
		<div class="text-2xl text-center">What we have to offer:</div>
		<div class="mt-3">Corp PVP fleets</div>
		<div>Access to massive industrial infrastructure</div>
		<div>Active comms & community</div>
		<div>Experienced leadership</div>
	</div>

	<div
		class="flex flex-col justify-center bg-background-900 bg-opacity-80 border-2 border-background-900 rounded-md px-10 py-5 mt-5 min-w-fit"
	>
		<div class="text-2xl text-center">Interested?</div>
		<Button href="{base}/join" target="_blank" class="text-xl py-5 px-8 mt-4">Join Today</Button>
	</div>
</div>
