<svelte:head>
	<title>Trade</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { owner_name } from '../store.js'
    import { makeChart } from '../test.js'

    import Button, {Group, GroupItem, Label, Icon} from '@smui/button';
    import Card from '@smui/card';
    import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
    import Chip, {Set, Checkmark, Text} from '@smui/chips';
    import Select, {Option} from '@smui/select';

    import Textfield, {Input, Textarea} from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text/index';

    let direction = 'buy';
    let directions = ['buy', 'sell'];

    let type = 'limit';
    let types = ['limit', 'market'];

    let valuePrice = '';
    let valueAmount = '';

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
.add_order_form {
    border: 0px solid black;
}
.trade_topbar {
    border: 1px solid gray;
}

.columns {
}
.columns > * {
    margin: 1em;

}
</style>

<div class="trade_topbar">
    Market select goes here..
</div>


<div id="chart"></div>

<h2>Form to submit order</h2>

<div class="columns add_order_form">
<form on:submit|preventDefault="{handleSubmit}">

    <div>
    <Select variant="filled" bind:value={direction} label="Direction">
      {#each directions as d}
        <Option value={d} selected={direction === d}>{d}</Option>
      {/each}
    </Select>

    <Select variant="filled" bind:value={type} label="Type">
      {#each types as t}
        <Option value={t} selected={type === t}>{t}</Option>
      {/each}
    </Select>

    </div>

    <div>
    <Textfield lineRipple={false} bind:value={valuePrice} label="Price" input$aria-controls="helper-text-price" input$aria-describedby="helper-text-price" />
    </div>

    <div>
    <Textfield lineRipple={false} bind:value={valueAmount} label="Amount" input$aria-controls="helper-text-amount" input$aria-describedby="helper-text-amount" />
    </div>

    <div>
    <Button variant="raised" on:click={handleSubmit}>Submit Order</Button>
    </div>

</form>
</div>


<h2>Active orders</h2>

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


