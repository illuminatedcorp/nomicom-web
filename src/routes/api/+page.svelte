<script lang="ts">
	import { onMount } from 'svelte';
	import SwaggerUI from 'swagger-ui';

	onMount(() => {
		SwaggerUI({
			dom_id: '#swagger-ui',
			url: 'https://nomicon.illuminatedcorp.com/api/v1/openapi',
			presets: [SwaggerUI.presets.apis],
			plugins: [SwaggerUI.plugins.DownloadUrl],
			layout: 'BaseLayout',
			deepLinking: true
		});
	});
</script>

<div class="grid bg-background-50">
	<div id="swagger-ui"></div>
</div>
