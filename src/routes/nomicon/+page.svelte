<script lang="ts">
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import { userStore } from '@/stores/userStore';

	import { useCharacters } from '@/models/useCharacters';
	const { getMainCharacter, redirectToAddCharacter } = useCharacters();

	import { useAuth } from '@/models/useAuth';
	const { hasRole } = useAuth();

	import PapMetrics from '@/components/PapMetrics.svelte';
	import Dashboard from '@/components/Dashboard.svelte';
	import DirectorDashboard from '@/components/DirectorDashboard.svelte';

	let mainCharacter = getMainCharacter(get(userStore));
	let characterIds = get(userStore).characters.map((c) => c.eve_id);

	let papMetrics;
	let dashboard;
	let directorDashboard;

	onMount(() => {
		userStore.subscribe(async () => {
			let user = get(userStore);
			mainCharacter = getMainCharacter(user);
			characterIds = user.characters.map((c) => c.eve_id);
		});
	});

	const onAddCharacter = () => {
		redirectToAddCharacter();
	};

	// const onRemoveCharacter = () => {
	// 	console.log('remove character');
	// };

	const onTabChange = () => {
		papMetrics.update();
		directorDashboard.update();
	};
</script>

{#if mainCharacter}
	<div class="max-lg:flex max-lg:flex-col lg:grid lg:grid-cols-3 h-full overflow-hidden">
		<div class="flex flex-col lg:col-span-1 background-gradient h-full overflow-hidden p-3">
			<div class="flex items-center gap-1 bg-background-900 shadow-sm shadow-black">
				<img src="https://images.evetech.net/characters/{mainCharacter.eve_id}/portrait" alt="portrait" width="100" />

				<div class="flex flex-col justify-start gap-2 mt-1 h-full ml-1">
					<a
						href="https://evewho.com/character/{mainCharacter.eve_id}"
						target="_blank"
						rel="noopener noreferrer"
						class="border-2 border-background-200 hover:border-primary-50"
					>
						<img src={`https://images.evetech.net/characters/0/portrait`} alt="evewho icon" width="24" />
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

			<div class="flex flex-col shadow-sm shadow-black">
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
			</div>

			<div class="flex-grow"></div>

			<div class="flex flex-col bg-background-900 text-left shadow-sm shadow-black">
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
					<a href="https://goonfleet.com/" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-primary-50 transition-none">
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

		<div class="lg:col-span-2 background-gradient h-full overflow-hidden">
			<Tabs.Root value="dashboard" class="flex flex-col w-full max-lg:h-fit lg:h-full" onValueChange={onTabChange}>
				<Tabs.List class="flex gap-3 justify-start bg-transparent h-fit w-full border-b-2 rounded-none px-3 py-2">
					<Tabs.Trigger
						value="dashboard"
						class="text-xl bg-background-800 text-background-50 data-[state=active]:bg-primary-600 data-[state=active]:text-background-50"
					>
						Dashboard
					</Tabs.Trigger>
					<!-- <Tabs.Trigger value="historic" class="text-xl bg-background-800 text-background-50 data-[state=active]:bg-primary-600 data-[state=active]:text-background-50">
						Historic PAPs
					</Tabs.Trigger> -->

					<div class="flex-grow"></div>

					{#if hasRole('director')}
						<Tabs.Trigger
							value="directors"
							class="text-xl bg-background-800 text-background-50 data-[state=active]:bg-primary-600 data-[state=active]:text-background-50"
						>
							Director Dashboard
						</Tabs.Trigger>
					{/if}
				</Tabs.List>
				<Tabs.Content value="dashboard" class="overflow-hidden flex-grow">
					<Dashboard bind:this={dashboard} {characterIds} />
				</Tabs.Content>
				<Tabs.Content value="historic" class="overflow-hidden flex-grow">
					<PapMetrics bind:this={papMetrics} {characterIds} />
				</Tabs.Content>
				{#if hasRole('director')}
					<Tabs.Content value="directors" class="overflow-hidden flex-grow">
						<DirectorDashboard bind:this={directorDashboard} />
					</Tabs.Content>
				{/if}
			</Tabs.Root>
		</div>
	</div>
{/if}
