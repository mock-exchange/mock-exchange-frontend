<script>
  import { onMount } from "svelte";
  import formats from '../formats.js'

  export let rows
</script>

<table>
  <thead>
    <tr>
      <th>Trade</th>
      <th>Created</th>
      <th>Market</th>
      <th>Type</th>
      <th>Reference</th>
      <th class="right-align">Fee Rate</th>
      <th class="right-align">Fee</th>
      <th class="right-align">Amount</th>
      <th class="right-align">Price</th>
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
      <td>{ r.trade.market.name }</td>
      <td><span class="badge white-text" class:me-sell={r.order.side == 'sell'} class:me-buy={r.order.side == 'buy'}>{r.order.side }/{ r.order.type }</span></td>
      <td>
        <a href="">
        Order <span class="mex-id-field">{ r.order.uuid.substring(0,8) }</span>
        </a>
      </td>
      <td class="right-align">
        <small>{r.type}</small>
        { formats.percent(r.fee_rate) }
      </td>
      <td class="right-align">{ formats.fullnum(r.fee) }</td>
      <td class="right-align">{ formats.fullnum(r.amount) }</td>
      <td class="right-align">{ formats.fullnum(r.trade.price) }</td>
    </tr>
    {/each}
  </tbody>
</table>

