<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import { useApi } from '$lib/models/useApi.js';
  const { apiGet } = useApi();

  const afterLoginRedirectUrl = 'http://localhost:3000/TODO';

  onMount(async () => {
    // get the code from the url
    let code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      console.log('code', code);
      let response = await apiGet('login', { code });

      if (response.status === 200) {
        goto(afterLoginRedirectUrl);
      } else {
        console.error('error', response);
        // TODO what to do on error?
      }
    } else {
      // if they don't have a code, we send them to the login route
      goto('/login');
    }
  });
</script>

<div>
  Please wait...
</div>