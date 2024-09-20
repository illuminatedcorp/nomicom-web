<script lang="ts">
	import { get } from 'svelte/store';
	import { base } from '$app/paths';

	import { SITE_MODES } from '@/models/useConstants';
	import { styleStore, getMode } from '@/stores/styleStore';
	import { onMount } from 'svelte';

	const onSetSiteMode = (mode) => {
		let currentSelectedMode = get(styleStore).selectedMode;
		styleStore.set({ hoveredMode: mode, selectedMode: currentSelectedMode });
	};

	const onDarkClick = () => {
		styleStore.set({ hoveredMode: get(styleStore).hoveredMode, selectedMode: SITE_MODES.dark });
	};

	const onLightClick = () => {
		styleStore.set({ hoveredMode: get(styleStore).hoveredMode, selectedMode: SITE_MODES.light });
	};

	let currentMode = get(styleStore).selectedMode;

	onMount(() => {
		styleStore.subscribe(() => {
			currentMode = getMode();
		});
	});
</script>

<div class="grid grid-cols-3 justify-center items-center gap-24 mx-24 h-full {currentMode}">
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
		class="dark-button text-center text-4xl border-0 outline-none shadow-0 bg-transparent hover:bg-transparent hover:text-background-600 mb-16"
	>
		descend into darkness
	</button>

	<div class="flex justify-center mt-16 w-full">
		<img src="{base}/images/Illuminated-Logo.svg" alt="Logo" class="logo-image w-full" />
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
		class="light-button text-center text-4xl border-0 outline-none bg-transparent hover:bg-transparent hover:text-background-50 mb-16"
	>
		come into the light
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
