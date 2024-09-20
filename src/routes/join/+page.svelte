<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex justify-center items-center gap-16 w-full h-full">
	<div class="relative mx-3">
		<div class="background-border"></div>
		<div class="flex flex-col items-center justify-center relative z-10 p-10">
			<div class="max-lg:text-4xl lg:text-5xl text-center">Interested in joining?</div>
			<div
				class="flex flex-col max-lg:gap-3 lg:gap-1 max-lg:text-xl lg:text-2xl text-center mt-5 px-2"
			>
				<div>Illuminated is not only an EVE Online corporation, but also a community.</div>
				<div>We use Discord as our primary communication platform.</div>
				<div>If you are interested in joining, Discord is your first step.</div>
			</div>

			<Button href="https://discord.gg/illuminated" target="_blank" class="text-xl py-5 px-8 mt-4">
				Join Discord <i class="fab fa-discord ml-2" />
			</Button>

			<div class="separator mt-3" />

			<div class="text-center mt-5">
				<div
					class="flex flex-col max-lg:gap-3 lg:gap-1 max-lg:text-xl lg:text-2xl text-center mt-5 px-2"
				>
					<div>
						Once in Discord, look for the <span
							class="text-primary-50 font-bold bg-background-900 px-1 rounded-sm"
						>
							#onboarding-info
						</span> channel for instructions.
					</div>
					<div>To join, you must follow the instructions on our Wiki page to the letter.</div>
				</div>

				<Button
					href="https://wiki.illuminatedcorp.com/en/public/how-to-join"
					target="_blank"
					class="text-xl py-5 px-8 mt-4"
				>
					Illuminated Wiki
				</Button>
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
