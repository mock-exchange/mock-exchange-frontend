<svelte:head>
  <title>Mock Exchange</title>
</svelte:head>

<script>
  import { onMount } from "svelte";
  import formats from "../formats.js";

  let balances;
  let user = JSON.parse(sessionStorage.getItem('user'))

  onMount(async () => {

    fetch(`/api/balance?account_id=${user.id}`)
    .then(r => r.json())
    .then(data => {
        balances = data;
    });
  })
</script>

<h1>Balances for {user.name}</h1>


{#if balances}
<table>
  <thead>
    <tr>
      <th>Asset</th>
      <th class="right-align">Balance</th>
      <th class="right-align">Last Price</th>
      <th class="right-align">Value</th>
    </tr>
  </thead>
  <tbody>
    {#each balances as o }
    <tr>
      <td><i class="{o.icon} fa-2x fa-fw"></i> {o.name} ({o.symbol})</td>
      <td class="right-align">{ formats.number(o.balance) }</td>
      {#if o.symbol === 'USD'}
        <td class="right-align">&dash;</td>
        <td class="right-align">{ formats.currency_usd(o.balance) }</td>
      {:else}
        <td class="right-align">{ formats.currency_usd(o.last_price) }</td>
        <td class="right-align">{ formats.currency_usd(o.usd_value) }</td>
      {/if}
    </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}


