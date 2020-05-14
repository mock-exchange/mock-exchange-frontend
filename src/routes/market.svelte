<svelte:head>
  <title>Markets</title>
</svelte:head>

<script>
  import { onMount } from "svelte";

  let assets;
  let markets;

  onMount(async () => {
    fetch(`/api/market`)
    .then(r => r.json())
    .then(data => {
      markets = data.results;
    });
    fetch(`/api/asset`)
    .then(r => r.json())
    .then(data => {
      assets = data.results;
    });

  })
</script>


<table>
<thead>
  <tr>
    <th>Market</th>
    <th>24h Volume</th>
    <th>90d Volume</th>
    <th>24h Open</th>
    <th>24h High</th>
    <th>24h Low</th>
    <th>Last Price</th>
  </tr>
</thead>

<tbody>
  {#if markets}
    {#each markets as market }
    <tr>
    <td>{market.name}</td>
    <td>..</td>
    <td>..</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    </tr>
    {/each}
  {:else}
    <tr class="loading"><td colspan="7">loading...</td></tr>
  {/if}
</tbody>
</table>


<div>
  <button class="btn">New Asset</button>
</div>

<table>
<thead>
  <tr>
    <th>Asset</th>
    <th>something</th>
  </tr>
</thead>

<tbody>
  {#if assets}
    {#each assets as asset }
    <tr>
    <td>{asset.name}</td>
    <td>..</td>
    </tr>
    {/each}
  {:else}
    <tr class="loading"><td colspan="2">loading...</td></tr>
  {/if}
</tbody>
</table>


