<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import debounce from 'lodash/debounce';

	import { useRoles } from '@/models/useRoles';
	const { getAllRoles } = useRoles();

	import { useUsers } from '@/models/useUsers';
	const { getAllUsers, updateUserRoles } = useUsers();

	import { useCharacters } from '@/models/useCharacters';
	import Input from './ui/input/input.svelte';
	const { getMainCharacter } = useCharacters();

	let selectedUser = null;
	let userSearchTerm = '';

	let users = [];
	let filteredUsers = [];
	let allRoles = [];

	onMount(async () => {
		users = await getAllUsers();
		allRoles = await getAllRoles();
		filteredUsers = users;
	});

	const onChangeRoles = async (role) => {
		if (hasRole(role)) {
			selectedUser.roles = selectedUser.roles.filter((r) => r.id !== role.id);
		} else {
			selectedUser.roles = [...selectedUser.roles, role];
		}

		let result = await updateUserRoles(selectedUser);

		if (result) {
			toast.success('User roles updated');
		} else {
			toast.error('Failed to update user roles');
		}
	};

	// const onDeleteUser = () => {
	// 	console.log('Delete user');
	// };

	const hasRole = (role) => {
		const roleIds = selectedUser.roles.map((r) => r.id);
		return roleIds.includes(role.id);
	};

	const searchUsers = debounce(async () => {
		if (userSearchTerm === '') {
			filteredUsers = users;
			return;
		}

		filteredUsers = users.filter((user) => {
			const character = getMainCharacter(user);
			return character.name.toLowerCase().includes(userSearchTerm.toLowerCase());
		});
	}, 300);

	$: {
		userSearchTerm;
		searchUsers();
	}

	export const update = async () => {
		users = await getAllUsers();
		allRoles = await getAllRoles();
	};
</script>

<div class="flex flex-col h-full">
	<div class="text-3xl">User Management</div>
	<p>Users management stuff</p>

	<div class="flex gap-3 flex-grow mt-3 overflow-hidden">
		<div class="flex flex-col border-2 border-black">
			<div class="flex items-center min-w-48 border-b-4 border-black bg-black py-1 px-2">
				<div>Users</div>
			</div>
			<Input
				bind:value={userSearchTerm}
				class="border-background-600 my-1 p-2"
				placeholder="Search users..."
			/>
			<div class="overflow-y-auto">
				{#each filteredUsers as user}
					<button
						on:click={() => (selectedUser = user)}
						class="flex py-1 px-2 bg-background-800 hover:bg-background-700 border-b-2 border-background-600 w-full"
					>
						{getMainCharacter(user)?.name || 'No Main Character'}
					</button>
				{/each}
			</div>
		</div>

		<div class="flex flex-col flex-grow border-2 border-black bg-background-900">
			<div class="bg-black py-2 px-2">User Details</div>

			{#if selectedUser !== null}
				<div class="flex flex-col px-2 pt-2 overflow-hidden">
					<div class="flex gap-4 items-end justify-between">
						<div class="text-2xl">
							{getMainCharacter(selectedUser)?.name || 'No Main Character'}
						</div>

						<!-- <Button
							on:click={onDeleteUser}
							variant="outline"
							class="text-base hover:bg-red-900 hover:text-background-50 border-2 border-background-600 h-8"
						>
							Delete
						</Button> -->
					</div>

					<div class="text-base text-background-300">User ID: {selectedUser.id}</div>

					{#key selectedUser.id}
						<div class="flex gap-2 flex-wrap w-full mt-3">
							<div class="flex flex-col flex-grow bg-background-800">
								<div class="bg-black px-2">Characters</div>
								<div class="overflow-y-auto">
									{#each selectedUser.characters as character}
										<div class="py-1 px-2 border-b-2 border-background-800">
											{character.name} ({character.eve_id})
										</div>
									{/each}
								</div>
							</div>

							<div class="flex flex-col flex-grow bg-background-800">
								<div class="bg-black px-2">Roles</div>
								<div class="overflow-y-auto">
									{#each allRoles as role}
										<div class="flex items-center gap-2 py-1 px-2 border-b-2 border-background-800">
											<input
												type="checkbox"
												checked={hasRole(role)}
												on:change={() => onChangeRoles(role)}
											/>
											<div>{role.name}</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/key}
				</div>
			{:else}
				<div class="px-2 py-3">Select a role to view and select its permissions.</div>
			{/if}
		</div>
	</div>
</div>
