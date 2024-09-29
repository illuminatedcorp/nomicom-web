<script>
	import { onMount } from 'svelte';
	import debounce from 'lodash/debounce';
	import { toast } from 'svelte-sonner';

	import Button from '@/components/ui/button/button.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import Input from '@/components/ui/input/input.svelte';

	import { useRoles } from '@/models/useRoles';
	const { getAllRoles, createRole, getAllPermissions, updateRole, deleteRole } = useRoles();

	let roles = [];
	let allPermissions = [];
	let filteredPermissions = [];
	let selectedRole = null;

	onMount(async () => {
		roles = await getAllRoles();
		allPermissions = await getAllPermissions();
		filteredPermissions = allPermissions;
	});

	const onNewRole = async () => {
		await createRole();
		roles = await getAllRoles();
	};

	const onChangePermission = (permission) => {
		if (selectedRole.permissions.includes(permission)) {
			selectedRole.permissions = selectedRole.permissions.filter((p) => p !== permission);
		} else {
			selectedRole.permissions = [...selectedRole.permissions, permission];
		}

		onUpdateSelectedRole();
	};

	const onSearchPermissions = (e) => {
		const search = e.target.value.toLowerCase();
		filteredPermissions = allPermissions.filter((p) => p.toLowerCase().includes(search));
	};

	const onUpdateSelectedRole = debounce(async () => {
		let success = await updateRole(selectedRole);
		roles = await getAllRoles();

		if (success) {
			toast.success('Role updated');
		} else {
			toast.error('Failed to update role');
		}
	}, 300);

	const onDeleteRole = async () => {
		let success = await deleteRole(selectedRole);
		roles = await getAllRoles();

		if (success) {
			selectedRole = null;
			toast.success('Role deleted');
		} else {
			toast.error('Failed to delete role');
		}
	};

	export const update = async () => {
		roles = await getAllRoles();
		allPermissions = await getAllPermissions();
		filteredPermissions = allPermissions;
	};
</script>

<div class="flex flex-col h-full">
	<div class="text-3xl">Role Management</div>

	<div class="flex gap-3 flex-grow mt-3 overflow-hidden">
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
				<div class="flex flex-col px-2 overflow-hidden">
					<div class="flex gap-4 items-end justify-between">
						<Input
							bind:value={selectedRole.name}
							on:input={onUpdateSelectedRole}
							placeholder="Role name"
							class="text-2xl border-0 border-b-2 rounded-none mt-2 w-0 flex-grow truncate"
						/>

						<Button
							on:click={onDeleteRole}
							variant="outline"
							class="text-base hover:bg-red-900 hover:text-background-50 border-2 border-background-600 h-8"
						>
							Delete
						</Button>
					</div>

					<Textarea
						bind:value={selectedRole.description}
						on:input={onUpdateSelectedRole}
						placeholder="Role description"
						class="text-base border-background-600 mt-2"
					/>

					<Input
						placeholder="Search Permissions"
						on:input={onSearchPermissions}
						class="border-background-600 mt-2"
					/>

					<div class="overflow-y-auto">
						{#each filteredPermissions as permission}
							<div class="flex items-center gap-2 py-1 px-2 border-b-2 border-background-800">
								<input
									type="checkbox"
									disabled={permission === 'admin'}
									checked={selectedRole.permissions.includes(permission)}
									on:change={() => onChangePermission(permission)}
								/>
								<div>{permission}</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="px-2 py-3">Select a role to view and select its permissions.</div>
			{/if}
		</div>
	</div>
</div>
