<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';

	import { WEB_ROUTES } from '@/models/useConstants';

	import { useAuth } from '@/models/useAuth';
	const { safeGoto } = useAuth();
</script>

<div class="flex flex-col p-3">
	<div class="text-3xl">Admin Dashboard</div>

	<div class="mt-3">
		<Button on:click={() => safeGoto(WEB_ROUTES.adminRoles)}>Role Management</Button>
	</div>
</div>
