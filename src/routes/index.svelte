<svelte:head>
  <title>Mock Exchange</title>
</svelte:head>

<script>
  import { onMount } from "svelte";
  import formats from '../formats.js';

  let markets;

  onMount(async () => {
    fetch(`/api/last24`)
    .then(r => r.json())
    .then(data => {
      markets = data
    });
  })
</script>

<h1>Markets</h1>

<table>
<thead>
  <tr>
    <th>Market</th>
    <th>24h Volume</th>
    <th>24h Price</th>
    <th>24h Open</th>
    <th>24h High</th>
    <th>24h Low</th>
    <th>Last Price</th>
    <th>Avg Price</th>
  </tr>
</thead>

<tbody>
  {#if markets}
    {#each markets as m }
    <tr>
    <td><a href="/trade/{m.name}">{m.name}</a></td>
    <td>{ formats.compact_number(m.volume) }</td>
    <td
      class:red-text={m.change < 0}
      class:green-text={m.change > 0}
    >{ formats.percent(m.change) }</td>
    <td>{ formats.currency_usd(m.open) }</td>
    <td>{ formats.currency_usd(m.high) }</td>
    <td>{ formats.currency_usd(m.low) }</td>
    <td>{ formats.currency_usd(m.close) }</td>
    <td>{ formats.currency_usd(m.avg_price) }</td>
    </tr>
    {/each}
  {:else}
    <tr class="loading"><td colspan="7">loading...</td></tr>
  {/if}
</tbody>
</table>


