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

	let showScrollIndicator = true;

	const scrollToValueSection = () => {
		document.querySelector('.value-proposition-section')?.scrollIntoView({ 
			behavior: 'smooth' 
		});
	};

	const handleScroll = () => {
		showScrollIndicator = window.scrollY < 100;
	};

	let currentMode = get(styleStore).selectedMode;

	onMount(() => {
		styleStore.subscribe(() => {
			currentMode = getMode();
		});

		window.addEventListener('scroll', handleScroll);
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div class="hero-section">
	<div
		style="font-family: Garamond, sans-serif;"
		class="max-lg:flex max-lg:flex-col-reverse max-lg:justify-end max-lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-0 lg:justify-center items-center lg:mx-40 h-full {currentMode}"
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
		class="dark-button text-center text-4xl border-0 outline-none shadow-0 bg-transparent hover:bg-transparent hover:text-background-600 lg:py-12 lg:mb-16 xl:mb-28 whitespace-nowrap"
	>
		{#if $styleStore.selectedMode === SITE_MODES.dark}
			dwell in the dark
		{:else if $styleStore.selectedMode === SITE_MODES.light}
			fall from grace
		{:else}
			descend into darkness
		{/if}
	</button>

	<div class="flex flex-col items-center justify-center relative lg:mt-16 lg:my-10">
		<div class="absolute text-5xl lg:-top-14 max-lg:top-28 max-lg:text-2xl max-lg:mt-4 z-20 whitespace-nowrap">Which way capsuleer?</div>
		<img src="{base}/images/Illuminated-Logo.svg" alt="Logo" class="logo-image max-lg:max-h-96 lg:h-[700px]" />
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
		class="light-button text-center text-4xl border-0 outline-none bg-transparent hover:bg-transparent hover:text-background-50 lg:py-12 lg:mb-16 xl:mb-28 whitespace-nowrap"
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
	
	{#if showScrollIndicator}
		<div class="scroll-indicator">
			<div class="scroll-arrow animate-bounce" on:click={scrollToValueSection}>
				<i class="fas fa-chevron-down text-2xl text-white opacity-70"></i>
			</div>
		</div>
	{/if}
</div>

<section class="value-proposition-section">
	<div class="container mx-auto px-6 py-16">
		<div class="max-w-4xl mx-auto text-center">
			<h2 class="text-5xl font-bold mb-8 text-white" style="font-family: Garamond, sans-serif;">Our Mission</h2>
			<p class="text-xl mb-12 text-gray-300 leading-relaxed">
				Illuminated Corporation stands at the crossroads of darkness and light, offering capsuleers 
				a choice that defines their destiny among the stars. Whether you seek redemption through 
				righteous purpose or embrace the shadows of profit and power, we provide the framework 
				for your journey.
			</p>
			
			<div class="grid md:grid-cols-2 gap-12 mt-16">
				<div class="text-center">
					<h3 class="text-3xl font-semibold mb-6 text-white" style="font-family: Garamond, sans-serif;">Path of Light</h3>
					<p class="text-gray-400 leading-relaxed">
						Join our industrial and mining operations. Build, create, and contribute to the prosperity 
						of New Eden through honest work and collaborative effort. Find purpose in construction 
						rather than destruction.
					</p>
				</div>
				
				<div class="text-center">
					<h3 class="text-3xl font-semibold mb-6 text-white" style="font-family: Garamond, sans-serif;">Path of Darkness</h3>
					<p class="text-gray-400 leading-relaxed">
						Embrace the void through PvP operations, mercenary work, and the pursuit of power. 
						Hunt among the stars, claim what is yours by right of strength, and leave your mark 
						on the galaxy through decisive action.
					</p>
				</div>
			</div>
			
			<div class="mt-16">
				<p class="text-lg text-gray-400 mb-8">
					Ready to choose your path? Join thousands of capsuleers who have found their calling.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button class="bg-yellow-600 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
						Apply to Join
					</button>
					<button class="border border-gray-500 hover:border-gray-300 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
						Learn More
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	.hero-section {
		min-height: 100vh;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		padding-bottom: 4rem;
	}

	.value-proposition-section {
		background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%);
		min-height: 100vh;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 10;
	}

	.scroll-indicator {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
	}

	@media (max-height: 600px) {
		.scroll-indicator {
			bottom: 1rem;
		}
	}

	.scroll-arrow {
		cursor: pointer;
		transition: opacity 0.3s ease;
	}

	.scroll-arrow:hover {
		opacity: 1 !important;
	}

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
