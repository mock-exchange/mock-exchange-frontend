<style>

</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    //import { owner_name } from '../store.js'

    let balances;
    let owner_id;
    let owner_name;


    onMount(async () => {

        owner_id = window.localStorage.getItem('owner_id');
        owner_name = window.localStorage.getItem('owner_name');

        fetch(`/api/asset`)
        .then(r => r.json())
        .then(data => {
            balances = data;
        });
    })

</script>

<h1>Balances for {owner_name}</h1>


{#if balances}
<table>
  <thead>
    <tr>
      <th>Asset</th>
      <th>Amount</th>
      <th>Price</th>
      <th>24H Chg</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    {#each balances as o }
    <tr>
      <td><i class="{o.icon} fa-2x fa-fw"></i> {o.name} ({o.symbol})</td>
      <td>0</td>
      <td>$1299</td>
      <td>+ 4.5%</td>
      <td>$0</td>
    </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}


