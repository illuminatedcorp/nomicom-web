<script lang="ts">
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '@/stores/userStore';

	import { useCharacters } from '@/models/useCharacters';
	const { getMainCharacter, redirectToAddCharacter } = useCharacters();

	import PapMetrics from '@/components/PapMetrics.svelte';

	let mainCharacter = getMainCharacter(get(userStore));

	onMount(() => {
		userStore.subscribe(async () => {
			let user = get(userStore);
			mainCharacter = getMainCharacter(user);
		});
	});

	const onAddCharacter = () => {
		redirectToAddCharacter();
	};

	// const onRemoveCharacter = () => {
	// 	console.log('remove character');
	// };
</script>

{#if mainCharacter}
	<div class="max-lg:flex max-lg:flex-col lg:grid lg:grid-cols-2 h-full overflow-y-auto">
		<div class="flex flex-col max-lg:border-b-2 max-lg:h-fit background-gradient lg:h-full p-3">
			<div class="flex items-center gap-1 bg-background-900">
				<img
					src="https://images.evetech.net/characters/{mainCharacter.eve_id}/portrait"
					alt="portrait"
					width="100"
				/>

				<div class="flex flex-col justify-start gap-2 mt-1 h-full ml-1">
					<a
						href="https://evewho.com/character/{mainCharacter.eve_id}"
						target="_blank"
						rel="noopener noreferrer"
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
						rel="noopener noreferrer"
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
					class="flex items-center gap-2 text-base hover:bg-background-800 hover:text-background-50 border-2 border-background-600"
				>
					Add Character
					<i class="text-xs fas fa-external-link-alt transition-none"></i>
				</Button>
			</div>

			{#each $userStore.characters as character}
				<div class="flex items-center gap-2 px-2 py-1 bg-background-900">
					<div class="text-lg">{character.name} ({character.eve_id})</div>
					<div class="flex-grow"></div>
					{#if character.main}
						<div class="text-base text-primary-50">Main</div>
					{:else}
						<div class="text-base text-background-300">Alt</div>
					{/if}
					<!-- <Button on:click={onRemoveCharacter}>Remove</Button> -->
				</div>
			{/each}

			<div class="flex-grow"></div>

			<div class="flex flex-col bg-background-900 text-left">
				<div class="text-2xl bg-black px-2 py-1">Alliance Services</div>

				<div class="px-2">
					<a
						href="https://esi.goonfleet.com/"
						rel="noopener noreferrer"
						class="flex items-center gap-2 hover:text-primary-50 transition-none"
					>
						Goonswarm ESI Auth Website
						<i class="text-xs fas fa-external-link-alt transition-none"></i>
					</a>
					<a
						href="https://goonfleet.com/"
						rel="noopener noreferrer"
						class="flex items-center gap-2 hover:text-primary-50 transition-none"
					>
						Goonswarm Forums
						<i class="text-xs fas fa-external-link-alt transition-none"></i>
					</a>
					<a
						href="https://wiki.goonswarm.org/w/Main_Page"
						rel="noopener noreferrer"
						class="flex items-center gap-2 hover:text-primary-50 transition-none"
					>
						Goonswarm Wiki
						<i class="text-xs fas fa-external-link-alt transition-none"></i>
					</a>
					<a
						href="https://fleets.gnf.lt/dashboard"
						rel="noopener noreferrer"
						class="flex items-center gap-2 hover:text-primary-50 transition-none"
					>
						Dankfleet Dashboard
						<i class="text-xs fas fa-external-link-alt transition-none"></i>
					</a>
					<a
						href="https://affordablecare.goonfleet.com/home"
						rel="noopener noreferrer"
						class="flex items-center gap-2 hover:text-primary-50 transition-none"
					>
						Affordable Care - Goonswarm SRP
						<i class="text-xs fas fa-external-link-alt transition-none"></i>
					</a>
					<a
						href="https://skills.apps.gnf.lt/"
						rel="noopener noreferrer"
						class="flex items-center gap-2 hover:text-primary-50 transition-none"
					>
						Imperium Skill Checker
						<i class="text-xs fas fa-external-link-alt transition-none"></i>
					</a>
				</div>
			</div>
		</div>

		<div class="flex flex-col text-center items-center justify-center background-gradient h-full">
			<PapMetrics characterId={mainCharacter.eve_id} />
		</div>
	</div>
{/if}
