<script lang="ts">
	let iframe;
</script>

<div class="flex items-center justify-center">
	<div class="testing">
		<iframe
			bind:this={iframe}
			title="PAP Metrics"
			src="http://finance.birdhouse.ink/public/dashboard/e3ba0b98-b0bc-42d1-9095-f31a389958eb#theme=night&bordered=false&titled=false"
			allowtransparency
			class="testing-iframe"
		></iframe>
	</div>
</div>

<style>
	.testing {
		position: relative;
		overflow: hidden;
		width: calc(100% - 20px);
		max-width: 1045px;
		height: 544px;
		border-radius: 8px;
	}

	.testing-iframe {
		position: absolute;
		top: -66px;
		left: -35px;
		width: calc(100% + 70px);
		height: 800px;
	}
</style>
