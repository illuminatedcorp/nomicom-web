<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div
	class="flex flex-col items-center gap-8 w-full h-full justify-start sm:mt-5 pt-12 pb-12 overflow-auto"
	style="font-family: Garamond, sans-serif;"
>
	<div class="relative mx-3 h-fit">
		<div class="background-border"></div>
		<div class="flex flex-col items-center justify-center relative z-10 px-6 pt-6 max-sm:max-w-xl sm:max-w-4xl">
			<div class="max-sm:text-4xl sm:text-5xl text-center">Join us today</div>
			<div class="flex flex-col max-lg:gap-3 text-lg lg:gap-1 text-center mt-5 mb-3">
				Below is a step-by-step guide to join the Illuminated family. Following this guide accurately is important. Follow this exactly as
				stated and if all goes well, you will be invited to join.
			</div>

			<div class="separator" />

			<div
				class="grid max-sm:grid-cols-1 sm:grid-cols-[150px,1fr] items-center justify-center max-sm:gap-3 sm:gap-12 w-full max-sm:my-3 sm:my-8 px-2"
			>
				<div class="step-header">Step #1</div>
				<Button
					on:click={() => {
						window.open('https://discord.gg/illuminated', '_blank');
					}}
					class="flex items-center text-xl py-5 px-8"
				>
					Join the Discord server <i class="fab fa-discord ml-2" />
				</Button>
			</div>

			<div class="separator" />

			<div class="step-section">
				<div class="step-header">Step #2</div>
				<div class="text-xl">
					Add all of your characters to our
					<a href="https://auth.illuminatedcorp.com/auth/login" class="text-primary-50 underline hover:text-primary-200"
						>SeAT auth website</a
					><br /> You can add alts via the gear at icon at the top right of the site. We require this for background checks.
				</div>
			</div>

			<div class="separator" />

			<div class="step-section">
				<div class="step-header">Step #3</div>
				<div class="text-xl">
					Create an application in Discord by clicking the "Apply to Illuminated" button found in the
					<span class="text-primary-50">#onboarding-info</span> channel.
				</div>
			</div>

			<div class="separator" />

			<div class="step-section">
				<div class="step-header">Step #4</div>
				<div class="text-xl">
					Ping the <span class="text-primary-50">@Director</span> role for a voice interview. We just want to make sure you're a good fit for
					us, and we're a good fit for you.
				</div>
			</div>

			<div class="separator" />

			<div class="step-section">
				<div class="step-header">Step #5</div>
				<div class="text-xl">If the interview goes well, we'll run you through a background check.</div>
			</div>

			<div class="separator" />

			<div class="step-section max-sm:pb-6">
				<div class="step-header">Step #6</div>
				<div class="text-xl">Once everything checks out you'll be invited to join the corporation.</div>
			</div>
		</div>
	</div>

	<div class="relative mx-3 h-fit">
		<div class="background-border"></div>
		<div class="flex flex-col items-center justify-center relative z-10 px-6 pt-6 max-sm:max-w-xl sm:max-w-4xl">
			<div class="max-sm:text-4xl sm:text-5xl text-center">After joining</div>
			<div class="flex flex-col text-lg max-lg:gap-3 lg:gap-1 text-center mt-5 mb-3">
				It takes about an hour for our systems to recognize you are in the corporation. Once that happens, you will have access to the rest
				of the Discord server and our wiki that has more instructions.
			</div>

			<div class="separator" />

			<div class="flex flex-col mt-3 mb-6 px-3">
				<div class="step-header">Mandatory Requirements</div>
				<div class="text-xl mt-3">
					<div class="text-lg mb-2">
						We have mandatory requirements for our members. An interviewer will go over these with you and you will be given instructions on
						how to fufill these requirements as needed, but they are here for your reference:
					</div>

					<div class="ml-2"><span class="text-primary-50">•</span> You must have a working microphone.</div>
					<div class="ml-2">
						<span class="text-primary-50">•</span> All characters and alts must be registered on both our corp and the Goonswarm auth websites.
					</div>
					<div class="ml-2"><span class="text-primary-50">•</span> You must have Jabber set up to recieve pings.</div>
					<div class="ml-2"><span class="text-primary-50">•</span> You must have Mumble set up.</div>
					<div class="ml-2"><span class="text-primary-50">•</span> You must get 4 Strategic PAPs per month.</div>
					<div class="ml-2"><span class="text-primary-50">•</span> You must have an alpha alt character set up in Control Alt Delve.</div>
				</div>
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
		opacity: 0.7;
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

	.step-section {
		@apply grid max-sm:grid-cols-1 sm:grid-cols-[150px,1fr] items-center justify-center max-sm:gap-3 sm:gap-12 w-full max-sm:mb-3 max-sm:mt-1 sm:mb-8 sm:mt-6 px-2;
	}

	.step-header {
		@apply text-5xl max-sm:text-4xl whitespace-nowrap;
	}
</style>
