<script>
	import { onMount } from 'svelte';

	import Button from '@/components/ui/button/button.svelte';

	import { useRoles } from '@/models/useRoles';
	const { getAllRoles, createRole } = useRoles();

	let roles = [];
	let selectedRole = null;

	onMount(async () => {
		roles = await getAllRoles();
	});

	const onNewRole = async () => {
		await createRole();
		roles = await getAllRoles();
	};
</script>

<div class="flex flex-col p-3 h-full">
	<div class="text-3xl">Role Management</div>

	<div class="flex gap-3 flex-grow mt-3">
		<div class="flex flex-col border-2 border-black">
			<div
				class="flex items-center gap-2 justify-between min-w-48 border-b-4 border-black bg-black py-1 px-2"
			>
				<div>Roles</div>
				<Button
					variant="outline"
					class="text-base hover:bg-background-800 hover:text-background-50 border-2 border-background-600 h-8"
					on:click={onNewRole}>New Role</Button
				>
			</div>

			{#each roles as role}
				<button
					on:click={() => (selectedRole = role)}
					class="flex py-1 px-2 bg-background-800 hover:bg-background-700 border-b-2 border-background-600"
				>
					{role.name}
				</button>
			{/each}
		</div>

		<div class="flex flex-col flex-grow border-2 border-black bg-background-900">
			<div class="bg-black py-2 px-2">Permissions</div>

			{#if selectedRole !== null}
				<div>{selectedRole.name}</div>
				{JSON.stringify(roles)}
			{:else}
				<div class="px-2 py-3">Select a role to view and select its permissions.</div>
			{/if}
		</div>
	</div>
</div>
