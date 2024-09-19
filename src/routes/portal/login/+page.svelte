<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { base } from '$app/paths';

	let redirectUri = encodeURIComponent(
		import.meta.env.VITE_APP_HOST + base + '/portal/login/redirect'
	);
	let clientId = import.meta.env.VITE_EVE_APP_CLIENT_ID;
	let uuidState = uuidv4();
	let loginUrl = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&state=${uuidState}`;
</script>

<div class="flex flex-col items-center justify-center h-full">
	<div class="mt-10">
		Please log in with an EVE Online character that is associated with your account.
	</div>

	<a href={loginUrl} class="mt-5">
		<img
			src="https://web.ccpgamescdn.com/eveonlineassets/developers/eve-sso-login-white-large.png"
			alt="EVE SSO Login"
		/>
	</a>
</div>
