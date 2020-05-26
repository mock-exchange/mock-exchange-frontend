<script>
  import { onMount } from "svelte";
  import formats from '../formats.js'

  export let rows
</script>

<table>
  <thead>
    <tr>
      <th>Order</th>
      <th>Created</th>
      <th>Market</th>
      <th>Type</th>
      <th class="right-align">Price</th>
      <th class="right-align">Amount</th>
      <th class="right-align">Balance</th>
      <th class="right-align">Status</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as r }
    <tr>
      <td>
        <span class="mex-id-field">
        {#if r.uuid}
          { r.uuid.substring(0,8) }
        {:else}
          { r.id.toString().padStart(8, '0') }
        {/if}
        </span>
      </td>
      <td>{ formats.datetime(r.created) }</td>
      <td>{ r.market.name }</td>
      <td><span class="badge white-text" class:me-sell={r.side == 'sell'} class:me-buy={r.side == 'buy'}>{r.side }/{ r.type }</span></td>
      <td class="right-align">{ formats.currency_usd(r.price) }</td>
      <td class="right-align">{ formats.number(r.amount) }</td>
      <td class="right-align">{ formats.number(r.balance) }</td>
      <td class="right-align">{ r.status }</td>
    </tr>
    {/each}
  </tbody>
</table>

