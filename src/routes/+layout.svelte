<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import MarketingNav from '@/components/MarketingNav.svelte';
	import AtriumNav from '@/components/AtriumNav.svelte';

	import { initStore as initStyleStore } from '@/stores/styleStore';
	import { userStore } from '@/stores/userStore';
	import { styleStore, getMode } from '@/stores/styleStore';

	import { useUsers } from '@/models/useUsers';
	const { setup: setupUserData } = useUsers();

	let ready = false;

	let currentMode = get(styleStore).selectedMode;

	onMount(async () => {
		await initStyleStore();
		setupUserData();

		styleStore.subscribe(() => {
			currentMode = getMode();
		});

		ready = true;
	});
</script>

<div class="flex flex-col relative h-full {currentMode}">
	<div class="background-picture {$userStore.valid ? 'hidden' : ''}"></div>

	{#if $userStore.valid}
		<AtriumNav />
	{:else}
		<MarketingNav />
	{/if}

	<div
		class="flex-grow relative {$userStore.valid ? 'bg-background-900' : ''} {ready
			? 'opacity-100'
			: 'opacity-0'} transition-opacity duration-300"
	>
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

	.dark {
		.background-picture {
			filter: brightness(10%) grayscale(100%) opacity(0.1);
		}
	}

	.light {
		.background-picture {
			filter: brightness(40%) grayscale(0%);
		}
	}

	.neutral {
		.background-picture {
			filter: brightness(10%) grayscale(100%);
		}
	}
</style>
