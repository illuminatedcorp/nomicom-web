<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import AdminDashboard from '@/components/AdminDashboard.svelte';
	import RolesManagement from '@/components/RolesManagement.svelte';
	import UsersManagement from '@/components/UsersManagement.svelte';

	let userManagement;
	let roleManagement;
	let dashboard;

	const onTabChange = () => {
		userManagement.update();
		roleManagement.update();
	};
</script>

<div class="flex pb-3 px-3 h-full overflow-hidden">
	<Tabs.Root value="dashboard" class="flex flex-col w-full h-full" onValueChange={onTabChange}>
		<Tabs.List class="flex gap-3 justify-start bg-transparent h-fit w-full border-b-2 rounded-none py-2">
			<Tabs.Trigger
				value="dashboard"
				class="text-xl bg-background-800 text-background-50 data-[state=active]:bg-primary-600 data-[state=active]:text-background-50"
			>
				Dashboard
			</Tabs.Trigger>
			<Tabs.Trigger
				value="users"
				class="text-xl bg-background-800 text-background-50 data-[state=active]:bg-primary-600 data-[state=active]:text-background-50"
			>
				Users
			</Tabs.Trigger>
			<Tabs.Trigger
				value="roles"
				class="text-xl bg-background-800 text-background-50 data-[state=active]:bg-primary-600 data-[state=active]:text-background-50"
			>
				Roles
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="dashboard" class="overflow-hidden flex-grow">
			<AdminDashboard bind:this={dashboard} />
		</Tabs.Content>
		<Tabs.Content value="users" class="overflow-hidden flex-grow">
			<UsersManagement bind:this={userManagement} />
		</Tabs.Content>
		<Tabs.Content value="roles" class="overflow-hidden flex-grow">
			<RolesManagement bind:this={roleManagement} />
		</Tabs.Content>
	</Tabs.Root>
</div>
