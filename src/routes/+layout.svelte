<script lang="ts">
	import '../app.css';
	import '../global.css';

	export const prerender = true;
</script>

<div class="app w-full h-full">
	<slot />
</div>

<style>
	.app {
		color: white;
		background: linear-gradient(to bottom, transparent, rgb(12, 12, 13)) rgb(12, 12, 13);
	}
</style>
