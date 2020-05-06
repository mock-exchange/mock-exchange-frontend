<svelte:head>
	<title>Markets</title>
</svelte:head>

<script>
    console.log("markets script tag");
    import { onMount } from "svelte";
    let markets;

    onMount(async () => {
        console.log("markets fetch");
        await fetch(`/api/market`)
        .then(r => r.json())
        .then(data => {
            markets = data;
        });
    })
</script>

<h1>List of Markets</h1>


{#if markets}
  {#each markets as market }
    <ul>
      <li>
        {market.name}
      </li>
    </ul>
  {/each}
{:else}
  <p class="loading">loading...</p>
{/if}

