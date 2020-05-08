<svelte:head>
    <title>Account</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { owner_name } from '../../store.js'

    import { goto, stores } from '@sapper/app';

    const { page } = stores();


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

    let entities = ['Ledger','Orders','Trades'];
    let entity;


    // This runs when the route changes
    $: if (process.browser) {
        entity = $page.params.entity
        console.log('process.browser  $page.params.entity:'+entity);

    }



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

<p>
Active: {active}
</p>

<div>
    {#each entities as tab}
        <a class="{entity === tab ? 'btn-small blue' : 'btn-small grey lighten-1'}" on:click={() => goto(`/account/${tab}`)}>{tab}</a>
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


