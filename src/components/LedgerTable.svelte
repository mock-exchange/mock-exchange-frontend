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
      <th>Reference</th>
      <th class="right-align">Amount</th>
      <th class="right-align">Balance</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as r }
    <tr>
      <td>
        <a href="">
          <span class="mex-id-field">{ r.uuid.substring(0,8) }</span>
        </a>
      </td>
      <td>{ formats.datetime(r.created) }</td>
      <td>{ r.asset.symbol }</td>
      <td>
        <a href="">
        { formats.capitalize(r.type) } <span class="mex-id-field">{r.trade_side.uuid.substring(0,8) }</span>
        </a>
      </td>
      <td class="right-align">{ formats.fullnum(r.amount) }</td>
      <td class="right-align">{ formats.fullnum(r.balance) }</td>
    </tr>
    {/each}
  </tbody>
</table>

