<svelte:head>
	<title>Assets</title>
</svelte:head>

<script>
  import { onMount } from "svelte";
  let assets;

  onMount(async () => {
      await fetch(`/api/asset`)
      .then(r => r.json())
      .then(data => {
          assets = data;
      });
  })
</script>

<h1>List of Assets</h1>

<p>Put list here.</p>

{#if assets}
  {#each assets as asset }
    <ul>
      <li>
        {asset.name}
      </li>
    </ul>
  {/each}
{:else}
  <p class="loading">loading...</p>
{/if}

