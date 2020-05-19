<script>
  import { goto } from '@sapper/app'
  import { onMount } from "svelte";

  onMount(async () => {

  })

  sessionStorage.removeItem('user')
  goto('/auth/login')
</script>
