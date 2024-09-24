<script lang="ts">
	import { base } from '$app/paths';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import { WEB_ROUTES } from '@/models/useConstants';
	import { styleStore, getMode } from '@/stores/styleStore';
	import { userStore } from '@/stores/userStore';

	import { useAuth } from '@/models/useAuth';
	const { safeGoto } = useAuth();

	let currentMode = get(styleStore).selectedMode;

	onMount(async () => {
		styleStore.subscribe(() => {
			currentMode = getMode();
		});
	});
</script>

<div
	class="{currentMode} grid max-lg:grid-cols-[auto,auto] max-lg:gap-x-4 lg:grid-cols-[1fr,auto,1fr] relative items-center justify-center tracking-wider pt-5 pb-2"
>
	<div
		class="flex justify-center max-sm:text-sm lg:text-lg max-lg:mt-5 items-center max-lg:gap-4 lg:gap-6 xl:gap-12 max-lg:order-1 max-lg:justify-end whitespace-nowrap"
	>
		<button
			on:click={() => safeGoto(WEB_ROUTES.contact)}
			class="nav-button font-bold hover:text-glow hover:!opacity-100"
		>
			Contact us
		</button>
		<a
			href="https://zkillboard.com/corporation/98718341/"
			target="_blank"
			rel="noopener noreferrer"
			class="nav-button font-bold hover:text-glow hover:!opacity-100"
		>
			Killboard
		</a>
	</div>

	<div class="flex flex-col relative items-center max-lg:col-span-2">
		<a
			href="{base}/"
			class="flex text-6xl max-lg:w-3/4 max-lg:max-h-10 bg-transparent justify-center hover:bg-transparent uppercase border-0 shadow-none hover:text-glow hover:bg-transparent hover:opacity-100"
			style="font-family: Garamond, serif;"
		>
			<img
				src="{base}/images/Illuminated-Text.svg"
				alt="Illuminated Logo"
				class="logo-button h-10"
			/>
		</a>

		<div
			class="corp-text absolute top-full max-md:-mt-1 lg:mt-1 md:text-base max-md:text-xs rounded-bl-xl rounded-br-xl text-background-300 tracking-widest whitespace-nowrap"
		>
			An EVE Online Corporation - Goonswarm Federation
		</div>
	</div>

	<div
		class="flex justify-center max-sm:text-sm lg:text-lg max-lg:mt-5 max-lg:gap-4 xl:gap-12 lg:gap-6 max-lg:order-2 max-lg:justify-start whitespace-nowrap"
	>
		<button
			on:click={() => safeGoto(WEB_ROUTES.join)}
			class="nav-button font-bold hover:text-glow hover:!opacity-100"
		>
			Join Today
		</button>

		{#if $userStore.valid}
			<button
				on:click={() => safeGoto(WEB_ROUTES.nomicon)}
				class="nav-button font-bold hover:text-glow hover:!opacity-100"
			>
				Nomicon
			</button>
		{:else}
			<button
				on:click={() => safeGoto(WEB_ROUTES.login)}
				class="nav-button font-bold hover:text-glow hover:!opacity-100"
			>
				Login
			</button>
		{/if}
	</div>
</div>

<style lang="postcss">
	.nav-button {
		transition: opacity 0.3s;
	}

	.corp-text {
		transition: opacity 0.3s;
	}

	.neutral {
		.nav-button {
			opacity: 0.4;
		}

		.logo-button {
			filter: brightness(60%) grayscale(0%) opacity(1);
		}

		.corp-text {
			opacity: 0.4;
		}
	}

	.light {
		.nav-button {
			opacity: 1;
		}

		.logo-button {
			filter: brightness(100%) grayscale(0%) opacity(1);
		}

		.corp-text {
			opacity: 1;
		}
	}

	.dark {
		.nav-button {
			opacity: 0.1;
		}

		.logo-button {
			filter: brightness(30%) grayscale(100%) opacity(0.1);
		}

		.corp-text {
			opacity: 0.1;
		}
	}

	.logo-button {
		transition: filter 0.3s;
	}

	.text-glow {
		text-shadow:
			0 0 10px #9b7f3c,
			0 0 10px #9b7f3c,
			0 0 20px #9b7f3c,
			0 0 20px #fff;
	}
</style>
