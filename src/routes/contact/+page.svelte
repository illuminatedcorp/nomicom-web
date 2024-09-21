<script lang="ts">
	import { base } from '$app/paths';

	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex justify-center items-center gap-16 w-full h-full">
	<div class="relative mx-3">
		<div class="background-border"></div>
		<div class="flex flex-col items-center justify-center relative z-10 p-10">
			<div class="text-5xl whitespace-nowrap">Who we are</div>
			<div class="max-sm:text-lg sm:text-2xl text-center mt-2">
				We are the Resplendent Light in the Darkest of Space
			</div>

			<div class="separator mt-3" />

			<div class="mt-3 text-center">Discord is the best way of contacting us.</div>

			<Button
				href="https://discord.gg/illuminated"
				target="_blank"
				class="flex items-center text-xl py-5 px-8 mt-4"
			>
				Join Discord <i class="fab fa-discord ml-2" />
			</Button>

			<div class="separator mt-3" />

			<div class="text-3xl mt-3">Other Links</div>

			<div class="flex gap-2">
				<a
					href="https://evemaps.dotlan.net/corp/Illuminated"
					target="_blank"
					class="underline hover:text-primary-200"
				>
					Dotlan
				</a>
				<a
					href="https://evewho.com/corporation/98718341"
					target="_blank"
					class="underline hover:text-primary-200"
				>
					EveWho
				</a>
				<a
					href="https://wiki.illuminatedcorp.com/"
					target="_blank"
					class="underline hover:text-primary-200"
				>
					Wiki
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.background-border {
		position: absolute; /* Ensure the base element is positioned relative to the pseudo-element */
		inset: 0;
		z-index: 1; /* Ensure the base element and its border appear above the background */
		border-width: 30px; /* Adjust the width to match the size of your border */
		border-style: solid; /* A solid border to support the image */
		border-image: url('/images/card_border.png') 40 round;
		filter: brightness(2) sepia(1) hue-rotate(0deg) saturate(0.5);
	}

	.background-border::before {
		content: '';
		position: absolute;
		inset: -16px; /* Optional: Adjust this value to control how far the background extends */
		z-index: 0; /* Ensure the background is behind the border */
		background: var(--color-background-800); /* Background color or image */
		opacity: 0.5;
		filter: brightness(0.2);
	}

	.separator {
		width: 100%;
		height: 10px;
		background-image: url('/images/separator.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 100%;
		filter: brightness(2) sepia(1) hue-rotate(0deg) saturate(0.5);
	}
</style>
