<script lang="ts">
	import { base } from '$app/paths';

	import Button from '$lib/components/ui/button/button.svelte';
	import { WEB_ROUTES } from '$lib/models/useConstants';

	import { useAuth } from '@/models/useAuth';
	const { safeGoto, hasAccessToRoute } = useAuth();
</script>

<div class="grid grid-cols-[1fr,auto,1fr] items-center tracking-wider py-1 px-2">
	<div class="flex items-center justify-start gap-2 h-full">
		<Button
			href="{base}{WEB_ROUTES.nomicon}"
			variant="ghost"
			class="nav-button text-base hover:bg-background-800 hover:text-background-50"
		>
			Home
		</Button>
		{#if hasAccessToRoute(WEB_ROUTES.wiki)}
			<Button
				on:click={() => safeGoto(WEB_ROUTES.wiki)}
				variant="ghost"
				class="nav-button
				text-base hover:bg-background-800 hover:text-background-50"
			>
				Wiki
			</Button>
		{/if}
		{#if hasAccessToRoute(WEB_ROUTES.buyback)}
			<Button
				on:click={() => safeGoto(WEB_ROUTES.buyback)}
				variant="ghost"
				class="nav-button text-base hover:bg-background-800 hover:text-background-50"
			>
				Buyback
			</Button>
		{/if}
		{#if hasAccessToRoute(WEB_ROUTES.admin)}
			<Button
				on:click={() => safeGoto(WEB_ROUTES.admin)}
				variant="ghost"
				class="nav-button text-base hover:bg-background-800 hover:text-background-50"
			>
				Admin
			</Button>
		{/if}
	</div>

	<a href="/" class="flex items-center nav-button text-2xl">Illuminated</a>

	<div class="flex items-center justify-end gap-2 h-full">
		<!-- <div
			class="flex nav-button items-center text-base hover:bg-background-800 hover:text-background-50 border-background-600 rounded-md border-2 px-3"
		>
			Search bar TODO
		</div> -->

		<Button
			href="https://zkillboard.com/corporation/98718341/"
			target="_blank"
			rel="noopener noreferrer"
			variant="ghost"
			class="nav-button text-base hover:bg-background-800 hover:text-background-50 px-2"
		>
			zK
		</Button>

		<Button
			href="https://discord.gg/illuminated"
			target="_blank"
			rel="noopener noreferrer"
			variant="ghost"
			class="nav-button text-base hover:bg-background-800 hover:text-background-50 px-2"
		>
			<i class="fab fa-discord" />
		</Button>
	</div>
</div>

<style>
	.nav-button {
		height: 100% !important;
	}
</style>
