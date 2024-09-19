<script lang="ts">
	import '../app.css';
	import '../global.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import { base } from '$app/paths';

	import { onMount } from 'svelte';
	import { sessionStore } from '$lib/stores/sessionStore';
	// import { API_ROUTES } from '$lib/models/useConstants';
	// import { useApi } from '$lib/models/useApi';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { WEB_ROUTES } from '@/models/useConstants';

	// const { apiCall } = useApi();

	let isAuthenticated = false;

	onMount(() => {
		sessionStore.subscribe(async (session) => {
			let data = await session;
			isAuthenticated = data.isAuthenticated;
		});
	});
</script>

<div class="flex flex-col h-full">
	{#if isAuthenticated}
		<div class="grid grid-cols-[1fr,auto,1fr] items-center tracking-wider bg-background-900 py-2">
			portal nav
		</div>
	{:else}
		<div
			class="grid grid-cols-[1fr,auto,1fr] relative items-center tracking-wider bg-background-900 py-2"
		>
			<div class="flex justify-center gap-4">
				<Button href="{base}{WEB_ROUTES.contact}" class="text-lg font-bold bg-transparent"
					>Contact us</Button
				>
				<Button
					href="https://zkillboard.com/corporation/98718341/"
					target="_blank"
					class="text-lg font-bold bg-transparent">Killboard</Button
				>
			</div>

			<Button
				href="{base}/"
				class="text-6xl bg-transparent hover:bg-transparent"
				style="font-family: Jacquard">Illuminated</Button
			>

			<div class="flex justify-center gap-4">
				<Button href="{base}{WEB_ROUTES.join}" class="text-lg font-bold bg-transparent"
					>Join Today</Button
				>
				<Button href="{base}{WEB_ROUTES.portal}" class="text-lg font-bold bg-transparent"
					>Login</Button
				>
				<!-- <Tooltip.Root openDelay={1}>
					<Tooltip.Trigger>
						<div>
							<Button class="text-lg font-bold bg-transparent opacity-40">Login</Button>
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content class="bg-background-800">
						<div class="text-xl">In progress</div>
					</Tooltip.Content>
				</Tooltip.Root> -->
			</div>

			<div class="absolute top-full flex justify-center w-full tracking-normal">
				<div class="text-base bg-background-900 rounded-bl-xl rounded-br-xl px-4">
					An EVE Online Corporation | Goonswarm Federation
				</div>
			</div>
		</div>
	{/if}

	<div class="flex-grow relative">
		<div class="background-picture"></div>
		<slot />
	</div>
</div>

<style>
	.background-picture {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background-image: url('/images/red-gallente.jpg');
		background-size: cover;
		background-position: center;
		filter: brightness(10%);
	}
</style>
