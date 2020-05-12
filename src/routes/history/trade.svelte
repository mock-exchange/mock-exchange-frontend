<svelte:head>
    <title>Account</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { owner_name } from '../../store.js'

    import { goto, stores } from '@sapper/app';

    const { page } = stores();


    let markets;

    let active_orders;
    let ledgers;
    let trades;

    onMount(async () => {
        console.log("markets fetch");
    })

    let active = 'Ledger'

    let entities = ['Ledger','Orders','Trades'];
    let entity;

    let id

    // This runs when the route changes
    $: if (process.browser) {
        entity = $page.params.entity
        console.log('process.browser  $page.params.entity:'+entity);

        id = window.localStorage.getItem('owner_id');

        if (entity === 'Ledger'){
            active_orders = undefined
        }
        else if (entity === 'Orders'){

            fetch(`/api/order?owner=` + id)
            .then(r => r.json())
            .then(data => {
                active_orders = data;
            });

        }
        else if (entity === 'Trades'){
            active_orders = undefined
        }

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

{#if entity === 'Orders'}

<h2>Orders</h2>

{#if active_orders}
<table>
  <thead>
    <tr>
      <th>Id</th>
      <th>Market</th>
      <th>Type</th>
      <th>Direction</th>
      <th>Price</th>
      <th>Amt</th>
      <th>Amt Left</th>
      <th>Balance</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {#each active_orders as o }
    <tr>
      <td>{o.id}</td>
      <td>{o.market.name}</td>
      <td>{o.type}</td>
      <td>{o.direction}</td>
      <td>{o.price}</td>
      <td>{o.amount}</td>
      <td>{o.amount_left}</td>
      <td>{o.balance}</td>
      <td>{o.status}</td>
    </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}

{/if}


{#if entity === 'Ledger'}

<h2>Ledger</h2>

{#if ledgers}

{:else}
  <p class="loading">loading...</p>
{/if}

{/if}


{#if entity === 'Trades'}

<h2>Trades</h2>

{#if 1}
<table>
    <thead>
        <tr>
            <th>Trade</th>
            <th>Executed</th>
            <th>Order Type</th>
            <th>Market</th>
            <th>Price</th>
            <th>Volume</th>
            <th>Cost</th>
        </tr>
    </thead>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}

{/if}

