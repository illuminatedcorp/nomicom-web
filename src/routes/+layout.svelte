<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import * as Tooltip from '$lib/components/ui/tooltip';

	import { styleStore, getMode } from '@/stores/styleStore';

	import { sessionStore } from '$lib/stores/sessionStore';
	import { WEB_ROUTES } from '@/models/useConstants';

	import { useUsers } from '@/models/useUsers';
	const { setup: setupUserData } = useUsers();

	let isAuthenticated = false;
	let currentMode = get(styleStore).selectedMode;

	onMount(() => {
		setupUserData();

		sessionStore.subscribe(async (session) => {
			let data = await session;
			isAuthenticated = data.isAuthenticated;
		});
		styleStore.subscribe(() => {
			currentMode = getMode();
		});
	});
</script>

<div class="flex flex-col relative h-full {currentMode}">
	<div class="background-picture"></div>

	{#if isAuthenticated}
		<div class="grid grid-cols-[1fr,auto,1fr] items-center tracking-wider py-2">portal nav</div>
	{:else}
		<div
			class="grid max-lg:grid-cols-[auto,auto] max-lg:gap-x-4 lg:grid-cols-[1fr,auto,1fr] relative items-center justify-center tracking-wider pt-5 pb-2"
		>
			<div
				class="flex justify-center max-sm:text-sm lg:text-lg max-lg:mt-5 items-center max-lg:gap-4 lg:gap-6 xl:gap-12 max-lg:order-1 max-lg:justify-end whitespace-nowrap"
			>
				<a
					href="{base}{WEB_ROUTES.contact}"
					class="nav-button font-bold hover:text-glow hover:!opacity-100"
				>
					Contact us
				</a>
				<a
					href="https://zkillboard.com/corporation/98718341/"
					target="_blank"
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
					class="corp-text absolute top-full max-md:-mt-2 lg:mt-1 md:text-base max-md:text-xs rounded-bl-xl rounded-br-xl text-background-300 tracking-widest whitespace-nowrap"
				>
					An EVE Online Corporation - Goonswarm Federation
				</div>
			</div>

			<div
				class="flex justify-center max-sm:text-sm lg:text-lg max-lg:mt-5 max-lg:gap-4 xl:gap-12 lg:gap-6 max-lg:order-2 max-lg:justify-start whitespace-nowrap"
			>
				<a
					href="{base}{WEB_ROUTES.join}"
					class="nav-button font-bold hover:text-glow hover:!opacity-100"
				>
					Join Today
				</a>
				<!-- <a
					href="{base}{WEB_ROUTES.portal}"
					class="nav-button text-lg font-bold hover:text-glow hover:!opacity-100"
				>
					Login
				</a> -->
				<Tooltip.Root openDelay={1}>
					<Tooltip.Trigger>
						<div class="nav-button font-bold hover:text-glow hover:!opacity-100">Login</div>
					</Tooltip.Trigger>
					<Tooltip.Content class="bg-background-800">
						<div class="text-xl">In progress</div>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</div>
	{/if}

	<div class="flex-grow relative">
		<slot />
	</div>
</div>

<style lang="postcss">
	.background-picture {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background-image: url('/images/background_angels_color.png');
		background-size: cover;
		background-position: center;
		filter: brightness(10%) contrast(100%) grayscale(100%);
		transition: filter 0.3s;
	}

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

		.background-picture {
			filter: brightness(10%) grayscale(100%);
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

		.background-picture {
			filter: brightness(40%) grayscale(0%);
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

		.background-picture {
			filter: brightness(10%) grayscale(100%) opacity(0.1);
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
