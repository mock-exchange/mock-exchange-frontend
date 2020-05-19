<svelte:head>
  <title>Trade</title>
</svelte:head>

<script>
  import { format } from 'date-fns'
  import Chart from "chart.js";

  import { goto, stores } from '@sapper/app';
  import formats from '../../formats.js'

  const { page } = stores();

  const options2 = { style: 'currency', currency: 'USD' };
  const numberFormat2 = new Intl.NumberFormat('en-US', options2);

  import { onMount } from "svelte";
  import { makeChart, updateChart } from '../../lightchart.js'


  let menu;
  let menu2;
  let menu3;
  let anchor2;
  let clicked = 'nothing yet';
  let clicked2 = 'nothing yet';
  let selected1 = 'Red';
  let selected2 = 'Small';

  let markets = [];
  let markets_idx = {};
  let this_market = {
    name: 'undef',
    asset: {
      icon: 'fas fa-question'
    }
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

  let polling_on = false
  let polling_inprogress = 0
  let polling_expired = false

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

    fetch(`/api/market`)
    .then(r => r.json())
    .then(data => {
      console.log('handle market results')
      markets = data.results;
      markets.forEach(m => {
        markets_idx[m['name']] = m['id']
      })
    });



    var elems = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(elems);

    var el = document.getElementById('market_drop_trigger');
    var instances2 = M.Dropdown.init(el, {
      alignment: 'left',
      coverTrigger: false,
      constrainWidth: false
    });


    makeChart('chart');
  })
  let myInterval;
  let myTimeout;

  let user

  // This runs when the route changes
  $: if (process.browser) {
    market = $page.params.market
    console.log('xx process.browser  $page.params.market:'+market);
    console.log('markets:',markets)
    this_market = markets_idx[market]

    user = sessionStorage.getItem('user')
    if (user){
      owner_id = user.id
    }

    console.log('owner_id:'+owner_id);

    fetch(`/api/order?status__in=open,partial&owner_id=${owner_id}`)
    .then(r => r.json())
    .then(data => {
      active_orders = data.results;
    });


    fetch(`/api/ohlc?interval=${interval}&market_id=${markets_idx[market]}`)
    .then(r => r.json())
    .then(data => {
      updateChart(data);
    });



    fetchChart()
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
          yAxisID: 'buy-side',
          label: "Buy Amounts",
          backgroundColor: green,
          borderColor: green,
          borderWidth: 0,
          steppedLine: 'after',
          data: amounts
        },
        {
          yAxisID: 'sell-side',
          label: "Sell Amounts",
          backgroundColor: red,
          borderColor: red,
          borderWidth: 0,
          steppedLine: 'before',
          data: sell_amounts
        }]
      }

      function getMaxNumberFromArray(array) {
          return array.reduce((a, b) => Math.max(a, b));
      }

      const maxYTick = Math.max(
          getMaxNumberFromArray(amounts),
          getMaxNumberFromArray(sell_amounts)
      );

      renderChart(maxYTick)
    });


  }

  function renderChart(maxYTick) {

    var ctx = document.getElementById("book_chart").getContext("2d");
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
                id: 'sell-side',
                position: 'right',
                type: 'linear',
                ticks: {
                    max: maxYTick,
                    callback: function(value, index, values) {
                        return formats.compact_number(value);
                    }
                }
            }, {
                id: 'buy-side',
                position: 'left',
                type: 'linear',
                ticks: {
                    max: maxYTick,
                    callback: function(value, index, values) {
                        return formats.compact_number(value);
                    }
                }
            }],
            xAxes: [{
                ticks: {
                    autoSkip: true,
                    autoSkipPadding: 10,
                    maxRotation: 0,
                    callback: function(value, index, values) {
                        return formats.currency_usd(value);
                    }
                }
            }]
        }
      }
    });
  }

  function togglePolling() {
    polling_on = !polling_on;
    polling_expired = false;

    if (polling_on) {
      myInterval = setInterval(() => { runPolling() }, 5*1000);
      myTimeout = setTimeout(() => { expirePolling() }, 30*1000);
    }
    else {
      window.clearInterval(myInterval);
    }
  }

  function expirePolling() {
    window.clearInterval(myInterval);
    polling_on = false;
    polling_expired = true
  }

  function runPolling() {
    polling_inprogress = 2;

    // &owner=${owner_id}
    fetch(`/api/trade?per_page=30&order=id&market_id=${markets_idx[market]}`)
    .then(r => r.json())
    .then(data => {
      trades = data.results;
      polling_inprogress -= 1;
    });

    fetch(`/api/last24/${markets_idx[market]}`)
    .then(r => r.json())
    .then(data => {
      last24 = data;
      polling_inprogress -= 1;
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
      owner_id: owner_id,
      side: side
    }
    var formdata = {
      method: 'place-order',
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
      order_id: order_id,
      owner_id: owner_id
    }
    var formdata = {
      method: 'cancel-order',
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
td, th {
  padding:0;
}

.trade_topbar {
    margin: 1em 0;
}
.trade_topbar .card-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 24px 5px 0;
    box-shadow: none;
    background-color: transparent;
}
.trade_topbar .card-panel > div {
  text-align: center;
}

.columns > * {
    margin: 1em;

}

.rightside {
    padding-top: 1em;
}
.rightside .btn-small {
    line-height: 20px;
    height: 20px;
}

.chart-container {
  position: relative;
  height:150px;
  width:100%;
}
</style>
<div class="row">
  <div class="col s9">

    <div class="row"><div class="col s12">
      <div class="trade_topbar">
        <div class="card-panel mex-card-panel">
          <div>
            <a id="market_drop_trigger" class="btn z-depth-0 dropdown-trigger" data-target="market_dropdown">
              <i class="fab fa-bitcoin fa-fw"></i>
              {market}
              <i class="material-icons right">arrow_drop_down</i>
            </a>

            <!-- Dropdown Structure -->
            <ul id="market_dropdown" class="collection dropdown-content">
              {#each markets as m }
                <li>
                <a href="/trade/{m.name}">
                  <div><i class="{m.asset.icon} fa-fw"></i> {m.name}</div>
                </a>
                </li>
              {/each}
            </ul>

          </div>
          <div>
            <div class="card-title">{ formats.currency_usd(last24.close) }</div>
            <div class="grey-text">Last trade price</div>
          </div>
          <div>
            <div class="card-title"
              class:red-text={last24.change < 0}
              class:green-text={last24.change > 0}
            >{formats.percent(last24.change)}</div>
            <div class="grey-text">24h Price</div>
          </div>
          <div>
            <div class="card-title">{ formats.compact_number(last24.volume) }</div>
            <div class="grey-text">24h Volume</div>
          </div>
          <div>
            <div class="card-title">{ formats.currency_usd(last24.avg_price) }</div>
            <div class="grey-text">Weighted Avg</div>
          </div>
        </div>
      </div>
    </div></div>

    <div class="row">
      <div class="col s6">
      <div class="mex-btn-group">
      {#each intervals as i }
        {#if i === interval}
          <button class="btn-small active">{ i }</button>
        {:else}
          <button class="btn-small" on:click={() => interval = i}>{ i }</button>
        {/if}
      {/each}
      </div>
      </div>
      <div class="col s6 right-align">
        {#if polling_inprogress}
          <span ><i class="fas fa-spinner fa-spin"></i> Polling in progress..</span>
        {:else if polling_expired}
          <span>Polling expired.</span>
        {/if}
        <button class="btn-small" on:click={togglePolling}>
        {#if polling_on}
          Polling On
        {:else}
          Polling Off
        {/if}
        </button>
      </div>
    </div>

    <div class="row"><div class="col s12">
      <div id="chart"></div>
    </div></div>

    <div class="row"><div class="col s12">
      <div class="chart-container">
        <canvas id="book_chart"></canvas>
      </div>
    </div></div>

    <div class="row"><div class="col s12">
      <div class="card-panel mex-card-panel">
        <div class="card-title">Open Orders</div>
      </div>

      {#if active_orders}
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Opened</th>
            <th>Type</th>
            <th>Market</th>
            <th class="right-align">Price</th>
            <th class="right-align">Amount</th>
            <th class="right-align">Bal</th>
            <th class="right-align">Cost</th>
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
                class:me-sell={o.side === 'sell'}
                class:me-buy={o.side === 'buy'}
              >{o.type}</span>
            </td>
            <td>{o.market.name}</td>
            <td class="right-align">{ formats.currency_usd(o.price) }</td>
            <td class="right-align">{ formats.number(o.amount) }</td>
            <td class="right-align">{ formats.number(o.balance) }</td>
            <td class="right-align">&dash;</td>
            <td>{o.status}</td>
            <td class="right-align">
              <button on:click={() => handleOrderCancel(o.id)} class="btn-small">Cancel</button>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
      {:else}
        <p class="loading">loading...</p>
      {/if}
    </div></div>

  </div>

  <div class="col m3 rightside">


    <div class="row"><div class="col s12">

    <form name="order_form" on:submit|preventDefault="{handleOrderSubmit}">

    <div class="row">
      <div class="col s12 mex-btn-group mex-btn-group-justified">
        <button on:click={() => side = 'buy'}
          class="btn"
          class:green={side === 'buy'}
        >Buy</button>
        <button on:click={() => side = 'sell'}
          class="btn"
          class:red={side === 'sell'}
        >Sell</button>
      </div>
    </div>
    <div class="row">
        <div class="right-align col s12">
            <button class="btn-small">Bid</button>
            <button class="btn-small">Ask</button>
            <button class="btn-small">Last</button>
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
            <button class="btn-small">25%</button>
            <button class="btn-small">50%</button>
            <button class="btn-small">75%</button>
            <button class="btn-small">100%</button>
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
    </div></div>

    <div class="row"><div class="col s12">
      <div class="card-panel mex-card-panel">
        <div class="card-title">Trade History</div>
      </div>

      {#if trades}
      <table>
        <thead>
          <tr>
            <th>Amt</th>
            <th>Price</th>
            <th class="right-align">Time</th>
          </tr>
        </thead>
        <tbody>
          {#each trades as o }
          <tr>
            <td>{ formats.number(o.amount) }</td>
            <td>{ formats.currency_usd(o.price) }</td>
            <td class="right-align">{ formats.time(o.created) }</td>
          </tr>
          {/each}
        </tbody>
      </table>
      {:else}
        <p class="loading">loading...</p>
      {/if}
    </div></div>




  </div>
</div>


