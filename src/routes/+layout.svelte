<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import 'swagger-ui/dist/swagger-ui.css';

	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	import MarketingNav from '@/components/MarketingNav.svelte';
	import NomiconNav from '@/components/NomiconNav.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	import { initStore as initStyleStore } from '@/stores/styleStore';
	import { styleStore, getMode } from '@/stores/styleStore';

	import { WEB_ROUTES } from '@/models/useConstants';
	import { userStore } from '@/stores/userStore';
	import { useUsers } from '@/models/useUsers';
	const { setup: setupUserData } = useUsers();

	let loading = true;
	let fadeInFlag = false;
	let currentMode = get(styleStore).selectedMode;
	let currentRoute = '';

	let standaloneRoutes = [WEB_ROUTES.loginRedirect, WEB_ROUTES.api];

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

		fadeIn();
	}
</script>

<Toaster
	toastOptions={{
		class: 'nomicon-toast'
	}}
/>

{#if !loading && $userStore.initialized && !standaloneRoutes.includes(currentRoute)}
	<div
		class="flex flex-col relative min-h-full transition-opacity duration-300 {fadeInFlag
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
				? 'background-gradient overflow-hidden'
				: 'overflow-auto'} "
		>
			<slot />
		</div>
	</div>
{/if}

{#if standaloneRoutes.includes(currentRoute)}
	<slot />
{/if}

<style lang="postcss">
	.background-picture {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: -1;
		background-image: url('/images/background_angels_color.png');
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
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
