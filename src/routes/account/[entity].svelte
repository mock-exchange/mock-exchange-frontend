<svelte:head>
    <title>Account</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { owner_name } from '../store.js'

    import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
    import Tab, {Icon, Label} from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Button from '@smui/button';

    let markets;

    let active_orders;

    onMount(async () => {
        console.log("markets fetch");
        var id = window.localStorage.getItem('owner_id');

        await fetch(`/api/order?owner=` + id)
        .then(r => r.json())
        .then(data => {
            active_orders = data;
        });
    })

    let active = 'Ledger'

</script>

<style>
.button_row {
    border: 1px dashed black;
    padding: 1em;
    margin: 1em;
}

a.btn-small {
    margin: 0 1em;
}


</style>

<div class="button_row">
    {#each ['Ledger', 'Orders', 'Trades'] as tab}
        <Button class="asscheese" on:click={() => active = tab} ripple={false} variant="{active === tab ? 'unelevated' : 'outlined'}" color="{active === tab ? 'primary' : ''}"><Label>{tab}</Label></Button>
    {/each}
</div>

<p>
Active: {active}
</p>

<div>
    {#each ['Ledger', 'Orders', 'Trades'] as tab}
        <a class="{active === tab ? 'btn-small blue' : 'btn-small grey lighten-1'}" on:click={() => active = tab}>{tab}</a>
    {/each}
</div>

<h2>Orders</h2>

{#if active_orders}
<DataTable table$aria-label="Order list" style="width: 100%;">
  <Head>
    <Row>
      <Cell>Id</Cell>
      <Cell>Market</Cell>
      <Cell>Type</Cell>
      <Cell>Direction</Cell>
      <Cell>Price</Cell>
      <Cell>Amt</Cell>
      <Cell>Amt Left</Cell>
      <Cell>Balance</Cell>
      <Cell>Status</Cell>
    </Row>
  </Head>
  <Body>
    {#each active_orders as o }
    <Row>
      <Cell>{o.id}</Cell>
      <Cell>{o.market}</Cell>
      <Cell>{o.type}</Cell>
      <Cell>{o.direction}</Cell>
      <Cell>{o.price}</Cell>
      <Cell>{o.amount}</Cell>
      <Cell>{o.amount_left}</Cell>
      <Cell>{o.balance}</Cell>
      <Cell>{o.status}</Cell>
    </Row>
    {/each}
  </Body>
</DataTable>
{:else}
  <p class="loading">loading...</p>
{/if}


