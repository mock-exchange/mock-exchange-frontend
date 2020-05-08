<svelte:head>
	<title>Trade</title>
</svelte:head>

<script>
    console.log("trade.svelte module init part");

    import { goto, stores } from '@sapper/app';

    const { page } = stores();

    import { onMount } from "svelte";
    import { owner_name } from '../../store.js'
    import { makeChart, updateChart } from '../../test.js'

    import Button, {Group, GroupItem, Label, Icon} from '@smui/button';
    import Card from '@smui/card';
    import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
    import Select, {Option} from '@smui/select';

    import Textfield, {Input, Textarea} from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text/index';


  import Menu, {SelectionGroup, SelectionGroupIcon} from '@smui/menu';
  import {Anchor} from '@smui/menu-surface';
  import List, {Item, Separator, Text, PrimaryText, SecondaryText, Graphic} from '@smui/list';
  let menu;
  let menu2;
  let menu3;
  let anchor2;
  let clicked = 'nothing yet';
  let clicked2 = 'nothing yet';
  let selected1 = 'Red';
  let selected2 = 'Small';

    let markets = [
        {
            name: 'BTCUSD',
            id: 1
        },
        {
            name: 'ETHBTC',
            id: 2
        },
        {
            name: 'ETHUSD',
            id: 3
        }
    ];
    let markets_idx = {
        'BTCUSD': 1,
        'ETHBTC': 2,
        'ETHUSD': 3
    };
    
    export let market;

    let direction = 'buy';
    let directions = ['buy', 'sell'];

    let type = 'limit';
    let types = ['limit', 'market'];

    let valuePrice = '';
    let valueAmount = '';

    let orders;
    let active_orders;


    let owner_id;


    onMount(async () => {
        console.log("trade.svelte module onMount");

        makeChart('chart');
    })

    // This runs when the route changes
    $: if (process.browser) {
        market = $page.params.market
        console.log('process.browser  $page.params.market:'+market);

        owner_id = window.localStorage.getItem('owner_id');

        console.log('owner_id:'+owner_id);

        fetch(`/api/order?status=open&owner=${owner_id}`)
        .then(r => r.json())
        .then(data => {
            active_orders = data;
        });

        fetch(`/api/order?owner=${owner_id}`)
        .then(r => r.json())
        .then(data => {
            orders = data;
        });

        
        fetch(`/api/ohlc?market=${markets_idx[market]}`)
        .then(r => r.json())
        .then(data => {
            updateChart(data);
        });
    }


    async function handleSubmit(event) {
        console.log('market:'+market);
    }
    
    async function navigateMarket(m) {
        console.log('navigateMarket')
        goto(`/trade/${m}`)
        //updateChart(markets_idx[m]);
        //console.log('market:'+market);
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

    <div use:Anchor bind:this={anchor2}>
      <Button on:click={() => menu2.setOpen(true)}>Market: {market}</Button>
      <Menu bind:this={menu2} anchor={false} bind:anchorElement={anchor2} anchorCorner="BOTTOM_LEFT">
        <List>
          {#each markets as m }
          <Item on:SMUI:action={() => goto(`/trade/${m.name}`)}>
            <Text>
              <PrimaryText>{m.name}</PrimaryText>
            </Text>
          </Item>
          {/each}
        </List>
      </Menu>
    </div>



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
    <Button variant="raised" type="submit">Submit Order</Button>
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


