<svelte:head>
	<title>Trade</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { owner_name } from '../store.js'
    import { makeChart } from '../test.js'

    import Button from '@smui/button';

    let orders;
    let active_orders;
    onMount(async () => {
        var id = window.localStorage.getItem('owner_id');

        await fetch(`/api/order?status=open&owner=` + id)
        .then(r => r.json())
        .then(data => {
            active_orders = data;
        });

        await fetch(`/api/order?owner=` + id)
        .then(r => r.json())
        .then(data => {
            orders = data;
        });

        makeChart('chart');

    })

    async function handleSubmit(event) {
        console.log(event);
        console.log(event.target);
        console.log(event.target.direction.value);
        console.log(event.target.type.value);
    }


</script>
<style>
</style>

<h1>Trade</h1>

<Button on:click={() => alert('Clicked!')}>Just a Button</Button>

<h2>Price chart here</h2>

<div id="chart"></div>

<h2>Form to submit order</h2>

<form on:submit|preventDefault="{handleSubmit}">

<label>Direction</label>
<select name="direction">
    <option value="buy">Buy</option>
    <option value="sell">Sell</option>
</select>

<label>Type</label>
<select name="type">
    <option value="limit">Limit</option>
    <option value="market">Market</option>
</select>
<label>Amount</label>
<input type="text" name="amount" />

<label>Price</label>
<input type="text" name="price" />

<button type="submit">Submit Order</button>

</form>

<h2>Active orders</h2>

{#if active_orders}
<table border=1 width="100%">
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
    <td>{o.market}</td>
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



<h2>Order history (closed)</h2>

{#if orders}
<table border=1 width="100%">
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
  {#each orders as o }
  <tr>
    <td>{o.id}</td>
    <td>{o.market}</td>
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


