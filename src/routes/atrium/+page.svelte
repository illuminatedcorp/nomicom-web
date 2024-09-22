<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import { WEB_ROUTES } from '$lib/models/useConstants';
	import { userStore } from '@/stores/userStore';
</script>

<div>atrium page</div>
<div>
	what do we want here<br /><br />

	the main page will probably be something like....<br />
	- main character info<br />
	- list of alt characters<br />
	- buttons for character crud<br />
	- a dashboard for important info or something<br />
	- maybe in the future bookmarks or something<br /><br />

	nav at the top will have a link to this base page called Home or something<br />
	illuminated in the center like marketing nav, but smaller? maybe that takes them back to the marketing
	page?<br />
</div>
