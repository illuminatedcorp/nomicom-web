<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '@/stores/userStore';

	import { useCharacters } from '@/models/useCharacters';
	import { onMount } from 'svelte';
	const { getMainCharacter, redirectToAddCharacter } = useCharacters();

	let mainCharacter = getMainCharacter();

	onMount(() => {
		userStore.subscribe(() => {
			mainCharacter = getMainCharacter();
		});
	});

	const onAddCharacter = () => {
		redirectToAddCharacter();
	};

	// const onRemoveCharacter = () => {
	// 	console.log('remove character');
	// };
</script>

<div class="max-lg:flex max-lg:flex-col lg:grid lg:grid-cols-2 h-full">
	<div class="flex flex-col border-r-2 border-black h-full p-3">
		<div class="flex items-center gap-1 bg-background-800 border-2 border-black">
			<img
				src="https://images.evetech.net/characters/{mainCharacter.eve_id}/portrait"
				alt="portrait"
				width="100"
				class="border-2 border-r-4 border-black"
			/>

			<div class="flex flex-col justify-start gap-2 mt-1 h-full">
				<a
					href="https://evewho.com/character/{mainCharacter.eve_id}"
					target="_blank"
					class="border-2 border-background-200 hover:border-primary-50"
				>
					<img
						src={`https://images.evetech.net/characters/0/portrait`}
						alt="evewho icon"
						width="24"
					/>
				</a>
				<a
					href="https://zkillboard.com/character/{mainCharacter.eve_id}/"
					target="_blank"
					class="border-2 border-background-200 hover:border-primary-50"
				>
					<img src={`https://zkillboard.com/img/wreck.png`} alt="zkill icon" width="24" />
				</a>
			</div>

			<div class="flex flex-col ml-3">
				<div class="text-2xl">{mainCharacter.name}</div>
				<div class="text-base text-background-300">Corporation name (TODO)</div>
				<div class="text-base text-background-300">Alliance name (TODO)</div>
			</div>
		</div>

		<div class="flex items-center justify-between bg-black px-2 py-1 mt-3">
			<div class="text-xl">Your Characters</div>
			<Button
				variant="outline"
				on:click={onAddCharacter}
				class="text-base hover:bg-background-800 hover:text-background-50 border-2 border-background-600"
			>
				Add Character
			</Button>
		</div>

		{#each $userStore.characters as character}
			<div class="flex items-center gap-2 px-2 py-1 border-2 border-black bg-background-800">
				<div class="text-lg">{character.name} ({character.eve_id})</div>
				<div class="flex-grow"></div>
				<!-- <Button on:click={onRemoveCharacter}>Remove</Button> -->
			</div>
		{/each}
	</div>

	<div
		class="flex flex-col text-center items-center justify-center max-lg:border-t-2 lg:border-l-2 border-black h-full p-3"
	>
		<!-- <div>dashboard for important info or something</div>
		<div>maybe in the future bookmarks or something</div> -->
		<div>This page is under construction.</div>
		<div>If you have ideas for what could go here, throw them in Discord.</div>
	</div>
</div>
