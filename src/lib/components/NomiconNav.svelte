<script lang="ts">
	import { base } from '$app/paths';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as HoverCard from '$lib/components/ui/hover-card';

	import { WEB_ROUTES } from '$lib/models/useConstants';

	import { useAuth } from '@/models/useAuth';
	const { safeGoto, hasAccessToRoute } = useAuth();
</script>

<div class="grid grid-cols-[1fr,auto,1fr] items-center tracking-wider py-1 px-2">
	<div class="flex items-center justify-start gap-2 h-full">
		<Button
			href="{base}{WEB_ROUTES.nomicon}"
			variant="ghost"
			class="text-base hover:bg-background-800 hover:text-background-50 max-md:px-2 h-full"
		>
			<div class="md:hidden">
				<i class="fas fa-home" />
			</div>
			<span class="max-md:hidden">Home</span>
		</Button>

		<HoverCard.Root openDelay={0} closeDelay={100}>
			<HoverCard.Trigger>
				<Button
					variant="ghost"
					class="
				text-base hover:bg-background-800 hover:text-background-50 h-full"
				>
					<div class="md:hidden">
						<i class="fas fa-info" />
					</div>
					<span class="max-md:hidden">Information</span>
				</Button>
			</HoverCard.Trigger>
			<HoverCard.Content class="w-28 bg-background-700 overflow-hidden p-0">
				<div class="flex flex-col items-start">
					{#if hasAccessToRoute(WEB_ROUTES.wiki)}
						<Button
							on:click={() => safeGoto(WEB_ROUTES.wiki)}
							variant="ghost"
							class="flex justify-start
				text-base hover:bg-background-800 text-background-50 hover:text-background-50 rounded-none w-full"
						>
							Wiki
						</Button>
					{/if}
					{#if hasAccessToRoute(WEB_ROUTES.news)}
						<Button
							on:click={() => safeGoto(WEB_ROUTES.news)}
							variant="ghost"
							class="flex justify-start
				text-base hover:bg-background-800 text-background-50 hover:text-background-50 rounded-none w-full"
						>
							News
						</Button>
					{/if}
				</div>
			</HoverCard.Content>
		</HoverCard.Root>

		{#if hasAccessToRoute(WEB_ROUTES.buyback)}
			<Button
				on:click={() => safeGoto(WEB_ROUTES.buyback)}
				variant="ghost"
				class="text-base hover:bg-background-800 hover:text-background-50 max-md:px-2 h-full"
			>
				<div class="md:hidden">
					<i class="fas fa-coins" />
				</div>
				<span class="max-md:hidden">Buyback</span>
			</Button>
		{/if}
		{#if hasAccessToRoute(WEB_ROUTES.admin)}
			<Button
				on:click={() => safeGoto(WEB_ROUTES.admin)}
				variant="ghost"
				class="text-base hover:bg-background-800 hover:text-background-50 max-md:px-2 h-full"
			>
				<div class="md:hidden">
					<i class="fas fa-cogs" />
				</div>
				<span class="max-md:hidden">Admin</span></Button
			>
		{/if}
	</div>

	<a href="/" class="flex items-center text-2xl h-full" style="font-family: Garamond, sans-serif;">
		Illuminated
	</a>

	<div class="flex items-center justify-end gap-2 h-full">
		<!-- <div
			class="flex nav-button items-center text-base hover:bg-background-800 hover:text-background-50 border-background-600 rounded-md border-2 px-3"
		>
			Search bar TODO
		</div> -->

		{#if hasAccessToRoute(WEB_ROUTES.api)}
			<Button
				on:click={() => safeGoto(WEB_ROUTES.api)}
				variant="ghost"
				class="text-base hover:bg-background-800 hover:text-background-50 px-2 h-full"
			>
				API
			</Button>
		{/if}

		<Button
			href="https://zkillboard.com/corporation/98718341/"
			target="_blank"
			rel="noopener noreferrer"
			variant="ghost"
			class="text-base hover:bg-background-800 hover:text-background-50 px-2 h-full"
		>
			zK
		</Button>

		<Button
			href="https://discord.gg/illuminated"
			target="_blank"
			rel="noopener noreferrer"
			variant="ghost"
			class="text-base hover:bg-background-800 hover:text-background-50 px-2 h-full"
		>
			<i class="fab fa-discord" />
		</Button>
	</div>
</div>
