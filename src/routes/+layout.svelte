<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import '../global.css';

	import { sessionStore } from '$lib/stores/sessionStore';
	import { API_ROUTES } from '$lib/models/useConstants';
	import { useApi } from '$lib/models/useApi';
	import Button from '$lib/components/ui/button/button.svelte';
	const { apiGet } = useApi();

	onMount(() => {
		let data = apiGet(API_ROUTES.getSession);
		sessionStore.set(data);
	});
</script>

<div class="flex flex-col text-white w-full h-full">
	<div class="grid grid-cols-[1fr,auto,1fr] items-center tracking-wider bg-background-900 py-2">
		<div class="flex justify-center gap-4">
			<Button href="/" class="text-lg font-bold bg-transparent">Home</Button>
			<Button
				href="https://auth.illuminatedcorp.com/"
				target="_blank"
				class="text-lg font-bold bg-transparent"
			>
				Auth
			</Button>
			<Button href="/buyback" class="text-lg font-bold bg-transparent">Buyback</Button>
		</div>

		<div class="text-6xl" style="font-family: Jacquard">Illuminated</div>

		<div class="flex justify-center gap-4">
			<Button
				href="https://discord.gg/illuminated"
				target="_blank"
				class="text-lg font-bold bg-transparent"
			>
				Discord
			</Button>
			<Button
				href="https://wiki.illuminatedcorp.com/"
				target="_blank"
				class="text-lg font-bold bg-transparent"
			>
				Wiki
			</Button>
			<Button
				href="https://zkillboard.com/corporation/98718341/"
				target="_blank"
				class="text-lg font-bold bg-transparent">Killboard</Button
			>
		</div>
	</div>

	<div class="flex-grow bg-background-800">
		<slot />
	</div>
</div>
