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
		document.querySelector('.scripture-section')?.scrollIntoView({ 
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
			<div class="scroll-divider" on:click={scrollToValueSection}>
				<div class="divider-line"></div>
				<div class="scroll-arrow animate-bounce">
					<i class="fas fa-chevron-down text-2xl text-white opacity-70"></i>
				</div>
				<div class="divider-line"></div>
			</div>
		</div>
	{/if}
</div>

<section class="scripture-section">
	<div class="manuscript-container">
		<!-- Ancient chapter heading -->
		<div class="chapter-heading">
			<div class="ornamental-flourish">✝</div>
			<h2 class="chapter-title" style="font-family: Garamond, serif;">
				THE ILLUMINATED PATH
			</h2>
			<div class="ornamental-flourish">✝</div>
		</div>
		
		<!-- Scripture verse -->
		<div class="verse-container">
			<p class="opening-verse" style="font-family: Garamond, serif;">
        <em>"Of my body and last spoils, you shall have nothing."</em>
			</p>
		</div>
		
		<!-- Ancient text blocks -->
		<div class="scripture-blocks">
			<div class="illuminated-manuscript">
				<div class="manuscript-image">
					<div class="image-placeholder inquisition-image"></div>
				</div>
				<div class="manuscript-text">
					<h3 class="illuminated-heading" style="font-family: Garamond, serif;">THE INQUISITION</h3>
					<p class="manuscript-body">
            From the shadows within hostile space, we strike with Stealth Bombers and Black Ops Battleships
            in our foreverwar PVP campaign, The Inquisition. This campaign is for those pilots who have
            a need to make the farms and fields of the enemy backline nervous about undocking in their own space
					</p>
				</div>
			</div>
			
			<div class="illuminated-manuscript reverse">
				<div class="manuscript-image">
					<div class="image-placeholder forge-image"></div>
				</div>
				<div class="manuscript-text">
					<h3 class="illuminated-heading" style="font-family: Garamond, serif;">FORGE OF WAR</h3>
					<p class="manuscript-body">
            With a litany of moons up to R64 rarity and access to the largest industrial infrastructure in New Eden,
            if building weapons of war is your calling, you shall find no better a place to amass wealth and
            ensure that the engines of conflict are well fueled.
					</p>
				</div>
			</div>
			
			<div class="illuminated-manuscript">
				<div class="manuscript-image">
					<div class="image-placeholder tribe-image"></div>
				</div>
				<div class="manuscript-text">
					<h3 class="illuminated-heading" style="font-family: Garamond, serif;">TRIBE OVER GUILD</h3>
					<p class="manuscript-body">
            We are far more than an Eve Online corporation. We value being a tribe over being a guild, and if the
            servers were to go cold tomorrow, we would continue onward. We value being something which is greater
            than the sum of its parts and carry that philosophy into all aspects of our order.
					</p>
				</div>
			</div>
			
			<div class="illuminated-manuscript reverse">
				<div class="manuscript-image">
					<div class="image-placeholder knowledge-image"></div>
				</div>
				<div class="manuscript-text">
					<h3 class="illuminated-heading" style="font-family: Garamond, serif;">SACRED KNOWLEDGE</h3>
					<p class="manuscript-body">
            The leaders of our organization are highly experienced and have put infrastructure in place to ensure
            that knowledge can be passed on to you. Our extensive wiki called Nomicon holds decades of New Eden
            wisdom and experience gathered from the shared knowledge held by the members of our tribe.
					</p>
				</div>
			</div>
			
			<div class="illuminated-manuscript">
				<div class="manuscript-image">
					<div class="image-placeholder crusade-image"></div>
				</div>
				<div class="manuscript-text">
					<h3 class="illuminated-heading" style="font-family: Garamond, serif;">THE GREAT CRUSADE</h3>
					<p class="manuscript-body">
            As a member of Goonswarm Federation, we are proud to board our doctrine ships and throw ourselves into
            the fray of the most massive battles ever to occur in the galaxy as part of the greatest story ever
            told in New Eden.
					</p>
				</div>
			</div>
		</div>
		
		<!-- Illuminated manuscript call to action -->
		<div class="manuscript-footer">
			<div class="illuminated-border">
				<h3 class="final-verse" style="font-family: Garamond, serif;">
					Seek the path of Illumination
				</h3>
				<p class="closing-text">
          Help us tell the story you've always wanted to be apart of in New Eden and join our ranks today
				</p>
				
				<div class="covenant-buttons">
					<a href="https://discord.gg/illuminated" target="_blank" rel="noopener noreferrer" class="covenant-btn">
						<i class="fas fa-cross" style="line-height: 1;"></i>
						<span style="line-height: 1;">JOIN US</span>
						<i class="fas fa-cross" style="line-height: 1;"></i>
					</a>
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

	.scripture-section {
		background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.85) 100%);
		min-height: 100vh;
		padding: 6rem 0;
		position: relative;
		z-index: 10;
		font-family: Garamond, serif;
	}

	.manuscript-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	/* Ancient Chapter Heading */
	.chapter-heading {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 4rem;
		gap: 2rem;
	}

	.ornamental-flourish {
		font-size: 2rem;
		color: rgba(152, 28, 32, 0.8);
		font-weight: 900;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	}

	.chapter-title {
		font-size: 2.5rem;
		color: #ffffff;
		text-align: center;
		font-weight: 300;
		letter-spacing: 0.3em;
		margin: 0;
		text-transform: uppercase;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	}

	/* Opening verse */
	.verse-container {
		text-align: center;
		margin-bottom: 4rem;
		padding: 2rem;
	}

	.opening-verse {
		font-size: 1.5rem;
		color: #d1d5db;
		line-height: 1.8;
		margin: 0;
		font-style: italic;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
	}

	/* Scripture blocks */
	.scripture-blocks {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		margin-bottom: 4rem;
	}

	.illuminated-manuscript {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 4rem;
		align-items: center;
		padding: 3rem 0;
		border-bottom: 1px solid rgba(152, 28, 32, 0.2);
	}

	.illuminated-manuscript.reverse {
		grid-template-columns: 1fr 280px;
	}

	.illuminated-manuscript.reverse .manuscript-image {
		order: 2;
	}

	.illuminated-manuscript.reverse .manuscript-text {
		order: 1;
		text-align: right;
	}

	.illuminated-manuscript:last-child {
		border-bottom: none;
	}

	.manuscript-image {
		position: relative;
	}

	.image-placeholder {
		width: 100%;
		height: 200px;
		background: rgba(0, 0, 0, 0.4);
		border: 2px solid rgba(152, 28, 32, 0.3);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.image-placeholder::before {
		content: '';
		position: absolute;
		top: -2px;
		left: -2px;
		right: -2px;
		bottom: -2px;
		background: linear-gradient(45deg, rgba(152, 28, 32, 0.1), transparent, rgba(152, 28, 32, 0.1));
		border-radius: 8px;
		z-index: -1;
	}

	.inquisition-image::after {
		content: '🗡';
		font-size: 3rem;
		color: rgba(152, 28, 32, 0.6);
		text-shadow: 0 0 20px rgba(152, 28, 32, 0.8);
	}

	.forge-image::after {
		content: '⚒';
		font-size: 3rem;
		color: rgba(152, 28, 32, 0.6);
		text-shadow: 0 0 20px rgba(152, 28, 32, 0.8);
	}

	.tribe-image::after {
		content: '☩';
		font-size: 3rem;
		color: rgba(152, 28, 32, 0.6);
		text-shadow: 0 0 20px rgba(152, 28, 32, 0.8);
	}

	.knowledge-image::after {
		content: '◈';
		font-size: 3rem;
		color: rgba(152, 28, 32, 0.6);
		text-shadow: 0 0 20px rgba(152, 28, 32, 0.8);
	}

	.crusade-image::after {
		content: '⚔';
		font-size: 3rem;
		color: rgba(152, 28, 32, 0.6);
		text-shadow: 0 0 20px rgba(152, 28, 32, 0.8);
	}

	.manuscript-text {
		padding: 0;
	}

	.illuminated-heading {
		font-size: 1.8rem;
		color: rgba(152, 28, 32, 0.9);
		margin: 0 0 1.5rem 0;
		font-weight: 400;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		font-family: Garamond, serif;
		position: relative;
	}


	.manuscript-body {
		font-size: 1.2rem;
		color: #e5e5e5;
		line-height: 1.8;
		margin: 0;
		text-align: justify;
		text-indent: 0;
		font-family: Garamond, serif;
	}

	.reverse .manuscript-body {
		text-align: justify;
		text-indent: 0;
	}

	@media (max-width: 768px) {
		.illuminated-manuscript,
		.illuminated-manuscript.reverse {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.illuminated-manuscript.reverse .manuscript-image {
			order: 1;
		}

		.illuminated-manuscript.reverse .manuscript-text {
			order: 2;
			text-align: left;
		}


		.reverse .manuscript-body {
			text-align: justify;
			text-indent: 0;
		}
	}

	/* Illuminated manuscript footer */
	.manuscript-footer {
		text-align: center;
		margin-top: 3rem;
	}

	.illuminated-border {
		border: 2px solid rgba(152, 28, 32, 0.3);
		padding: 3rem 2rem;
		position: relative;
		background: rgba(0, 0, 0, 0.3);
	}


	.final-verse {
		font-size: 2rem;
		color: #ffffff;
		margin: 0 0 1rem 0;
		font-weight: 300;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	}

	.closing-text {
		font-size: 1.2rem;
		color: #d1d5db;
		margin: 0 0 2rem 0;
		line-height: 1.6;
		font-style: italic;
		font-family: Garamond, serif;
	}

	.covenant-buttons {
		margin-top: 2rem;
	}

	.covenant-btn {
		background: transparent;
		color: rgba(152, 28, 32, 0.9);
		border: 2px solid rgba(152, 28, 32, 0.6);
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-family: Garamond, serif;
		display: inline-flex;
		align-items: baseline;
		justify-content: center;
		gap: 1.2rem;
		line-height: 1;
		text-decoration: none;
	}

	.covenant-btn:hover {
		background: rgba(152, 28, 32, 0.1);
		color: #ffffff;
		border-color: rgba(152, 28, 32, 0.8);
		text-shadow: 0 0 10px #981c20, 0 0 10px #981c20, 0 0 20px #981c20;
		box-shadow: 0 0 20px rgba(152, 28, 32, 0.3);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.section-title {
			font-size: 2.5rem;
		}
		
		.section-subtitle {
			font-size: 1.25rem;
		}
		
		.decorative-line {
			width: 60px;
		}
		
		.cta-title {
			font-size: 2rem;
		}
		
		.cta-buttons {
			flex-direction: column;
			align-items: center;
		}
		
		.stats-row {
			flex-direction: column;
			gap: 1rem;
		}
		
		.stat-divider {
			width: 2rem;
			height: 1px;
		}
	}

	.scroll-indicator {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
	}

	.scroll-divider {
		display: flex;
		align-items: center;
		gap: 1rem;
		opacity: 0.7;
		cursor: pointer;
	}

	.divider-line {
		width: 6rem;
		height: 2px;
		background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.7), transparent);
		border-radius: 1px;
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
			filter: grayscale(100%) brightness(150%);
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
			filter: grayscale(0%) brightness(110%) saturate(100%) !important;
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
