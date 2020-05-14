<svelte:head>
	<title>Trade</title>
</svelte:head>

<script>
    console.log("trade.svelte module init part");

    import { format } from 'date-fns'
    import Chart from "chart.js";

    import { goto, stores } from '@sapper/app';
    import formats from '../../formats.js'

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
    
    let intervals = ['1m','5m','15m','1h','6h','1d']
    let interval = '15m'

    export let market;

    let direction = 'buy';
    let directions = ['buy', 'sell'];

    let type = 'limit';
    let types = ['limit', 'market'];

    let valuePrice = '';
    let valueAmount = '';

    let orders;
    let active_orders;
    let trades;

    let book_chart;

    let owner_id;
    let side = 'buy'

    let last24 = {
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        avg_price: 0,
        volume: 0,
        change: 0
    };

    let red = 'rgba(228, 78, 93, 1)';
    let green = 'rgba(95, 186, 137, 1)';

    onMount(async () => {
        console.log("trade.svelte module onMount");

        var elems = document.querySelectorAll('.tabs');
        var instance = M.Tabs.init(elems);
        
        // Active
        window.addEventListener('focus', startTimer);

        // Inactive
        window.addEventListener('blur', stopTimer);


        makeChart('chart');
    })
    let myInterval;

    // This runs when the route changes
    $: if (process.browser) {
        market = $page.params.market
        console.log('process.browser  $page.params.market:'+market);

        owner_id = window.localStorage.getItem('owner_id');

        console.log('owner_id:'+owner_id);

        fetch(`/api/order?status__in=new,open&owner_id=${owner_id}`)
        .then(r => r.json())
        .then(data => {
            active_orders = data.results;
        });

        fetch(`/api/order?owner_id=${owner_id}`)
        .then(r => r.json())
        .then(data => {
            orders = data.results;
        });

        
        fetch(`/api/ohlc?interval=${interval}&market_id=${markets_idx[market]}`)
        .then(r => r.json())
        .then(data => {
            updateChart(data);
        });


        startTimer()

        //renderChart()
    }

    function fetchChart() {
        fetch(`/api/book?market_id=${markets_idx[market]}`)
        .then(r => r.json())
        .then(data => {
            book_chart = {}
            var prices = []
            var amounts = []
            var sell_amounts = []
            data.forEach(element => {
                prices.push(element['price'])

                var buy = 0;
                var sell = 0;
                if (element['side'] === 'buy'){
                    buy = element['total']
                    sell = 0
                }
                else { // sell
                    buy = 0
                    sell = element['total']
                }
                amounts.push(buy);
                sell_amounts.push(sell);
            });
            book_chart = {
                labels: prices,
                datasets: [{
                    label: "Buy Amounts",
                    backgroundColor: green,
                    borderColor: green,
                    borderWidth: 0,
                    data: amounts
                },
                {
                    label: "Sell Amounts",
                    backgroundColor: red,
                    borderColor: red,
                    borderWidth: 0,
                    data: sell_amounts
                }]
            }
            renderChart()
        });


    }

function abbreviateNumber(value) {
  let newValue = value;
  const suffixes = ["", "K", "M", "B","T"];
  let suffixNum = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  newValue = newValue.toPrecision(3);

  newValue += suffixes[suffixNum];
  return newValue;
}

  function renderChart() {


    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
      type: "line",
      data: book_chart,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return abbreviateNumber(value);
                    }
                }
            }],
            xAxes: [{
                ticks: {
                    autoSkip: true,
                    autoSkipPadding: 10,
                    maxRotation: 0
                }
            }]
        }
      }
    });
  }

    // Start timer
    function startTimer() {
        console.log('focus startTime()');
        fetchTrades()
        //myInterval = setInterval(() => { fetchTrades() }, 5000);
    }

    // Stop timer
    function stopTimer() {
        console.log('stopTimer');
        //window.clearInterval(myInterval);
    }


    function fetchTrades() {
        console.log('fetchTrades()')
        // &owner=${owner_id}
        fetch(`/api/trade?order=id&market_id=${markets_idx[market]}`)
        .then(r => r.json())
        .then(data => {
            trades = data.results;
        });

        fetch(`/api/last24?market_id=${markets_idx[market]}`)
        .then(r => r.json())
        .then(data => {
            last24 = data;
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
            market_id: 1,
            owner_id: 1,
            side: side
        }
        var formdata = {
            owner: 1,
            action: 'place-order',
            body: JSON.stringify(orderdata)
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
            owner_id: 1,
            action: 'cancel-order',
            body: JSON.stringify(orderdata)
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
        <div class="card-title grey-text text-darken-4">{ formats.currency_usd(last24.close) }</div>
        <div class="grey-text">Last trade price</div>
        </div>

        <div>
        <div class="card-title grey-text text-darken-4">{formats.percent(last24.change)}</div>
        <div class="grey-text">24h Price</div>
        </div>

        <div>
        <div class="card-title grey-text text-darken-4">{ formats.number(last24.volume) }</div>
        <div class="grey-text">24h Volume</div>
        </div>

        <div>
        <div class="card-title grey-text text-darken-4">{ formats.currency_usd(last24.avg_price) }</div>
        <div class="grey-text">Weighted Avg</div>
        </div>
    </div>
</div>


{#each intervals as i }
  {#if i === interval}
    <button class="btn-flat btn-small blue lighten-1">{ i }</button>
  {:else}
    <button class="btn-flat btn-small grey lighten-1" on:click={() => interval = i}>{ i }</button>
  {/if}
{/each}


    <div id="chart"></div>

<button on:click={() => fetchChart() }>Render Chart</button>
<div class="chart-container" style="border:1px dotted black; position: relative; height:150px; width:100%">
    <canvas id="myChart"></canvas>
</div>

<h2>Open Orders</h2>

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
      <td>
        <span class="badge white-text darken-2"
          class:red={o.direction === 'sell'}
          class:green={o.direction === 'buy'}
        >{o.type}</span>
      </td>
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

<h2>Trade History</h2>

{#if trades}
<table class="striped">
  <thead>
    <tr>
      <th>ID</th>
      <th>Amt</th>
      <th>Price</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
    {#each trades as o }
    <tr>
      <td>{ o.id }</td>
      <td>{ o.amount }</td>
      <td>{ o.price }</td>
      <td>{ format(Date.parse(o.created), 'hh:mm:ss aaa') }</td>
    </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}





  </div>
</div>


