<svelte:head>
	<title>Trade</title>
</svelte:head>

<script>
    console.log("trade.svelte module init part");

    import { format } from 'date-fns'

    import { goto, stores } from '@sapper/app';

    const { page } = stores();

    const options2 = { style: 'currency', currency: 'USD' };
    const numberFormat2 = new Intl.NumberFormat('en-US', options2);

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
    let side = 'buy'

    onMount(async () => {
        console.log("trade.svelte module onMount");

        var elems = document.querySelectorAll('.tabs');
        var instance = M.Tabs.init(elems);

        makeChart('chart');
    })

    // This runs when the route changes
    $: if (process.browser) {
        market = $page.params.market
        console.log('process.browser  $page.params.market:'+market);

        owner_id = window.localStorage.getItem('owner_id');

        console.log('owner_id:'+owner_id);

        fetch(`/api/order?status__in=new,open&owner=${owner_id}`)
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

    async function handleOrderSubmit(e) {
        console.log("handleOrderSubmit")
        
        var fe = document.forms.order_form.elements;

        var orderdata = {
            price: fe['price'].value,
            amount: fe['amount'].value,
            market: 1,
            owner: 1,
            direction: side
        }
        var formdata = {
            owner: 1,
            action: 'ao',
            payload: JSON.stringify(orderdata)
        }
        fetch(`/api/event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formdata)
        })
        .then(r => r.json())
        .then(data => {
            console.log('posted! data:',data)
        });

    }

    async function handleOrderCancel(order_id) {
        console.log("handleOrderCancel() order_id:"+order_id);
        var orderdata = {
            order_id: order_id
        }
        var formdata = {
            owner: 1,
            action: 'co',
            payload: JSON.stringify(orderdata)
        }
        fetch(`/api/event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formdata)
        })
        .then(r => r.json())
        .then(data => {
            console.log('posted! data:',data)
        });

    }

</script>
<style>
.add_order_form {
    border: 0px solid black;
}
.trade_topbar {
    margin: 1em 0;
}
.trade_topbar .card-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.trade_topbar .card-panel > div {
    text-align: center;
}

.columns {
}
.columns > * {
    margin: 1em;

}
.fuck > div {
}
.rightside {
    padding-top: 1em;
}
.rightside .btn-small {
    line-height: 20px;
    height: 20px;
}

</style>
<div class="fuck row">
  <div class="col s9">



<div class="trade_topbar">

    <div class="card-panel z-depth-0">
        <div>
            <div use:Anchor bind:this={anchor2}>
              <Button on:click={() => menu2.setOpen(true)}>{market}</Button>
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

        <div>
        <div class="card-title grey-text text-darken-4">$9,111</div>
        <div class="grey-text">Last</div>
        </div>

        <div>
        <div class="card-title grey-text text-darken-4">$10,499</div>
        <div class="grey-text">High</div>
        </div>

        <div>
        <div class="card-title grey-text text-darken-4">$9,349</div>
        <div class="grey-text">Low</div>
        </div>

        <div>
        <div class="card-title grey-text text-darken-4">19,349</div>
        <div class="grey-text">24H Volume</div>
        </div>

        <div>
        <div class="card-title grey-text text-darken-4">$9,989</div>
        <div class="grey-text">Weighted Avg</div>
        </div>
    </div>
</div>



    <div id="chart"></div>




<h2>Active orders</h2>

{#if active_orders}
<table class="striped">
  <thead>
    <tr>
      <th>Order</th>
      <th>Opened</th>
      <th>Type</th>
      <th>Market</th>
      <th class="right-align">Price</th>
      <th>Amount</th>
      <th>Cost</th>
      <th>Status</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#each active_orders as o }
    <tr>
      <td>{ o.id.toString().padStart(8, '0') }</td>
      <td>{ format(Date.parse(o.created), 'yyyy-mm-dd hh:mm:ss aaa') }</td>
      <td>{o.direction}/{o.type}</td>
      <td>{o.market.name}</td>
      <td class="right-align">{ numberFormat2.format(o.price) }</td>
      <td>
        {o.amount_left}/{o.amount}
      </td>
      <td>0</td>
      <td>{o.status}</td>
      <td>
        <button on:click={() => handleOrderCancel(o.id)} class="btn-small">Cancel</button>
      </td>
    </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}




  </div>
  <div class="col m3 rightside">
    <form name="order_form" on:submit|preventDefault="{handleOrderSubmit}">
    <div class="row">
      <ul class="tabs tabs-fixed-width">
        <li class="tab">
          <a href="#order_buy" on:click={() => side = 'buy'}
            class="green-text"
            class:active={side === 'buy'}
          >Buy</a></li>
        <li class="tab">
          <a href="#order_sell" on:click={() => side = 'sell'}
            class="red-text"
            class:active={side === 'sell'}
          >Sell</a></li>
      </ul>
    </div>
    <div class="row">
        <div id="order_buy" class="col s12">Buy order form</div>
        <div id="order_sell" class="col s12">Sell order form</div>
    </div>
    <div class="row">
        <div class="right-align col s12">
            <button class="btn-small btn-flat grey white-text">Bid</button>
            <button class="btn-small btn-flat grey white-text">Ask</button>
            <button class="btn-small btn-flat grey white-text">Last</button>
        </div>

        <div class="input-field col s12">
          <input id="price" name="price" type="text" class="validate">
          <label for="price">Price</label>
        </div>
    </div>
    <div class="row">
        <div class="input-field col s12">
          <input id="amount" name="amount" type="text" class="validate">
          <label for="amount">Amount</label>
        </div>
    </div>
    <div class="row">
        <div class="right-align col s12">
            <button class="btn-small btn-flat grey white-text">25%</button>
            <button class="btn-small btn-flat grey white-text">50%</button>
            <button class="btn-small btn-flat grey white-text">75%</button>
            <button class="btn-small btn-flat grey white-text">100%</button>
        </div>

        <div class="input-field col s12">
          <input id="total" type="text" class="validate">
          <label for="total">Total</label>
        </div>
    </div>


    <div>
        <button 
          class="btn col s12"
          class:red={side === 'sell'}
          class:green={side === 'buy'}
        >Place {side} order</button>
    </div>
    </form>


  </div>
</div>


