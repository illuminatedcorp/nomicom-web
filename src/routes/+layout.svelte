<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	import MarketingNav from '@/components/MarketingNav.svelte';
	import NomiconNav from '@/components/NomiconNav.svelte';

	import { initStore as initStyleStore } from '@/stores/styleStore';
	import { styleStore, getMode } from '@/stores/styleStore';

	import { useUsers } from '@/models/useUsers';
	import { WEB_ROUTES } from '@/models/useConstants';
	import { userStore } from '@/stores/userStore';
	const { setup: setupUserData } = useUsers();

	let loading = true;
	let fadeInFlag = false;
	let currentMode = get(styleStore).selectedMode;
	let currentRoute = '';

	onMount(async () => {
		currentRoute = $page.route.id;

		await initStyleStore();
		await setupUserData();

		styleStore.subscribe(() => {
			currentMode = getMode();
		});

		loading = false;
	});

	const fadeIn = async () => {
		if (!loading && $userStore.initialized && currentRoute !== WEB_ROUTES.loginRedirect) {
			setTimeout(() => {
				fadeInFlag = true;
			}, 400);
		}
	};

	$: {
		currentRoute = $page.route.id;
		$userStore;

		console.log(currentRoute);
		console.log(!loading && $userStore.initialized && currentRoute !== WEB_ROUTES.loginRedirect);
		fadeIn();
	}
</script>

{#if !loading && $userStore.initialized && currentRoute !== WEB_ROUTES.loginRedirect}
	<div
		class="flex flex-col relative h-full transition-opacity duration-300 {fadeInFlag
			? 'opacity-100'
			: 'opacity-0'} {currentMode}"
	>
		<div
			class="background-picture {currentRoute.startsWith(WEB_ROUTES.nomicon) ? 'hidden' : ''}"
		></div>

		{#if currentRoute.startsWith(WEB_ROUTES.nomicon)}
			<NomiconNav />
		{:else}
			<MarketingNav />
		{/if}

		<div
			class="flex-grow relative {currentRoute.startsWith(WEB_ROUTES.nomicon)
				? 'bg-background-900'
				: ''} "
		>
			<slot />
		</div>
	</div>
{/if}

{#if currentRoute === WEB_ROUTES.loginRedirect}
	<slot />
{/if}

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
