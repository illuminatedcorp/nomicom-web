<script lang="ts">
	import { get } from 'svelte/store';
	import { base } from '$app/paths';

	import { SITE_MODES, WEB_ROUTES } from '@/models/useConstants';
	import { styleStore, getMode, setModes } from '@/stores/styleStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const onSetSiteMode = (mode) => {
		let currentSelectedMode = get(styleStore).selectedMode;
		// styleStore.set({ hoveredMode: mode, selectedMode: currentSelectedMode });
		setModes(mode, currentSelectedMode);
	};

	const onDarkClick = () => {
		setModes(get(styleStore).hoveredMode, SITE_MODES.dark);
		// styleStore.set({ hoveredMode: get(styleStore).hoveredMode, selectedMode: SITE_MODES.dark });
		// open in new tab
		window.open('https://reddit.com/r/pandemichorde', '_blank');
	};

	const onLightClick = () => {
		// styleStore.set({ hoveredMode: get(styleStore).hoveredMode, selectedMode: SITE_MODES.light });
		setModes(get(styleStore).hoveredMode, SITE_MODES.light);
		goto(base + WEB_ROUTES.join);
	};

	let currentMode = get(styleStore).selectedMode;

	onMount(() => {
		styleStore.subscribe(() => {
			currentMode = getMode();
		});
	});
</script>

<div
	style="font-family: Garamond, sans-serif;"
	class="max-lg:flex max-lg:flex-col-reverse max-lg:justify-end max-lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-12 lg:justify-center items-center lg:mx-12 lg:h-full {currentMode}"
>
	<button
		on:mouseover={() => {
			onSetSiteMode(SITE_MODES.dark);
		}}
		on:mouseleave={() => {
			onSetSiteMode(SITE_MODES.neutral);
		}}
		on:focus={() => {
			onSetSiteMode(SITE_MODES.dark);
		}}
		on:blur={() => {
			onSetSiteMode(SITE_MODES.neutral);
		}}
		on:click={() => onDarkClick()}
		class="dark-button text-center text-4xl border-0 outline-none shadow-0 bg-transparent hover:bg-transparent hover:text-background-600 lg:mb-16 xl:mb-28 whitespace-nowrap"
	>
		{#if $styleStore.selectedMode === SITE_MODES.dark}
			dwell in the dark
		{:else if $styleStore.selectedMode === SITE_MODES.light}
			fall from grace
		{:else}
			descend into darkness
		{/if}
	</button>

	<div class="flex flex-col items-center justify-center relative lg:mt-16 lg:my-10 w-full">
		<div
			class="absolute text-5xl lg:-top-14 max-lg:top-28 max-lg:text-2xl max-lg:mt-4 z-20 whitespace-nowrap"
		>
			Which way capsuleer?
		</div>
		<img
			src="{base}/images/Illuminated-Logo.svg"
			alt="Logo"
			class="logo-image max-lg:max-h-96 w-full"
		/>
	</div>

	<button
		on:mouseover={() => {
			onSetSiteMode(SITE_MODES.light);
		}}
		on:mouseleave={() => {
			onSetSiteMode(SITE_MODES.neutral);
		}}
		on:focus={() => {
			onSetSiteMode(SITE_MODES.light);
		}}
		on:blur={() => {
			onSetSiteMode(SITE_MODES.neutral);
		}}
		on:click={() => onLightClick()}
		class="light-button text-center text-4xl border-0 outline-none bg-transparent hover:bg-transparent hover:text-background-50 lg:mb-16 xl:mb-28 whitespace-nowrap"
	>
		{#if $styleStore.selectedMode === SITE_MODES.dark}
			seek redemption
		{:else if $styleStore.selectedMode === SITE_MODES.light}
			bask in brilliance
		{:else}
			ascend into light
		{/if}
	</button>
</div>

<style lang="postcss">
	.logo-image {
		transition: filter 0.3s;
	}

	.light-button {
		transition:
			text-shadow 0.3s,
			color 0.3s;
	}

	.neutral {
		.logo-image {
			filter: grayscale(100%) brightness(200%);
		}

		.light-button:hover {
			text-shadow: none;
		}
	}

	.dark {
		.logo-image {
			filter: grayscale(100%) brightness(30%) !important;
		}

		.light-button {
			text-shadow: none;
			color: var(--color-background-800);
		}
	}

	.light {
		.logo-image {
			filter: grayscale(0%) brightness(160%) saturate(100%) !important;
		}

		.light-button:hover {
			text-shadow:
				0 0 10px #9b7f3c,
				0 0 10px #9b7f3c,
				0 0 20px #9b7f3c,
				0 0 20px #fff;
		}
	}

	.light-button {
		position: relative;
	}

	.dark-button {
		position: relative;
		transition: color 0.3s;
	}
</style>
