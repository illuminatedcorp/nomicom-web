<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	let redirectUri = encodeURIComponent('http://localhost:3000/login/redirect');
	let clientId = 'f20bc31482c549a1bd93ff106f21b83a';
	let uuidState = uuidv4();
	let loginUrl = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&state=${uuidState}`;
</script>

<div class="flex flex-col">
	<div>Accounts are tied to EVE Characters. We do not store sensitive login information.</div>
	<div>You may log in with any EVE Character that is associated to your account.</div>

	<a href={loginUrl}>
		<img
			src="https://web.ccpgamescdn.com/eveonlineassets/developers/eve-sso-login-white-large.png"
			alt="EVE SSO Login"
		/>
	</a>
</div>
