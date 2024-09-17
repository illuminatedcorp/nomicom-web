<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex justify-center items-center h-full">
	<div
		class="flex justify-center bg-background-900 bg-opacity-80 border-2 border-background-900 rounded-md px-10 py-5 mx-24 mt-10"
	>
		<div class="flex flex-col items-center">
			<div class="text-4xl">Interested in joining?</div>

			<div class="text-center mt-5">
				Illuminated is not only an EVE Online corporation, but also a community.
				<br />
				We use Discord as our primary communication platform. If you are interested in joining, Discord
				is your first step.
			</div>

			<Button href="https://discord.gg/illuminated" target="_blank" class="text-xl py-5 px-8 mt-4">
				Join Discord <i class="fab fa-discord ml-2" />
			</Button>

			<div class="text-center mt-5">
				<div>
					Once in Discord, look for the <span
						class="text-primary-200 font-bold bg-background-900 px-1 rounded-sm"
					>
						#onboarding-info
					</span> channel for instructions.
				</div>

				<div>To join, you must follow the instructions on our Wiki page to the letter.</div>

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
