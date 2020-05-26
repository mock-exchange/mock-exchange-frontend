<script>
  import { onMount } from "svelte";
  import formats from '../formats.js'

  export let rows
</script>

<table>
  <thead>
    <tr>
      <th>Ledger</th>
      <th>Created</th>
      <th>Asset</th>
      <th>Type</th>
      <th class="right-align">Amount</th>
      <th class="right-align">Balance</th>
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
      <td>{ r.asset.symbol }</td>
      <td><span class="badge white-text" class:me-sell={r.side == 'sell'} class:me-buy={r.side == 'buy'}>{r.side }/{ r.type }</span></td>
      <td class="right-align">{ formats.number(r.amount) }</td>
      <td class="right-align">{ formats.number(r.balance) }</td>
    </tr>
    {/each}
  </tbody>
</table>

