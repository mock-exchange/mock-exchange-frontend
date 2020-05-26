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
      <th class="right-align">Amount</th>
      <th class="right-align">Price</th>
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
      <td class="right-align">{ formats.number(r.amount) }</td>
      <td class="right-align">{ formats.number(r.price) }</td>
    </tr>
    {/each}
  </tbody>
</table>

