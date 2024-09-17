<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex justify-center items-center gap-16 w-full h-full">
	<div
		class="flex flex-col justify-center bg-background-900 bg-opacity-80 border-2 border-background-900 rounded-md px-10 py-5 mx-24 mt-10"
	>
		<div class="text-3xl">Contact Us</div>

		<div>Discord is the most effective way to contact corporation leadership.</div>

		<Button href="https://discord.gg/illuminated" target="_blank" class="text-xl py-5 px-8 mt-4">
			Join Discord <i class="fab fa-discord ml-2" />
		</Button>

		<div class="grid grid-cols-4 bg-background-800 px-2 mt-5">
			<div>Role</div>
			<div>Name</div>
			<div>Discord</div>
			<div>EVE Character</div>
		</div>

		<div class="grid grid-cols-4 bg-primary-900 bg-opacity-50 px-2 py-1">
			<div>CEO</div>
			<div>Isomerc</div>
			<div>isomerc</div>
			<a
				href="https://evewho.com/character/2035047876"
				target="_blank"
				class="underline hover:text-primary-200"
			>
				Isomerc
			</a>
		</div>

		<div class="grid grid-cols-4 bg-primary-800 bg-opacity-50 px-2 py-1">
			<div>HR</div>
			<div>Fryke</div>
			<div>fryke</div>
			<a
				href="https://evewho.com/character/1437193525"
				target="_blank"
				class="underline hover:text-primary-200"
			>
				Haigor
			</a>
		</div>

		<div class="mt-3">If discord is not an option, you may send someone an in-game mail.</div>
		<div>Though, do not expect a snappy response to a in-game mail.</div>

		<div class="text-3xl mt-7">Other Links</div>

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

	<!-- <div>image or something</div> -->
</div>
