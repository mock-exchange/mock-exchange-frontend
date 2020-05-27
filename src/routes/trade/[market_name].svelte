<svelte:head>
  <title>Trade {market.name}</title>
</svelte:head>

<script context="module">
  export async function preload(page, session) {
    const { market_name } = page.params;

    const res = await this.fetch(`/api/market`);
    const json = await res.json();
    const markets = json.results;

    let markets_idx = {}
    markets.forEach(m => {
      markets_idx[m['name']] = m
    })

    const market = markets_idx[market_name]

    return { market, markets }
  }
</script>

<script>
  import { onMount } from "svelte";
  import { goto, stores } from '@sapper/app';

  import Chart from "chart.js";
  import { makeChart, updateChart } from '../../lightchart.js'

  import { lastMarket } from '../../store.js'
  import formats from '../../formats.js'

  // Things depend on this stuff being fetched
  export let market = {};
  export let markets = [];

  const intervals = ['1m','5m','15m','1h','6h','1d']
  let interval = '15m'

  let pollingInterval;
  let pollingTimeout;

  let last24 = {
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    avg_price: 0,
    volume: 0,
    change: 0
  }

  let quick_price = {
    bid: 0,
    ask: 0,
    last: 0
  }

  let all_trades;
  let book_chart;
  let chart;

  let polling_on = false
  let polling_inprogress = 0
  let polling_expired = false

  let red = 'rgba(228, 78, 93, 1)';
  let green = 'rgba(95, 186, 137, 1)';

  let side = 'buy'

  // User specific
  let user
  let account_id;
  let active_orders;
  let pending_events; // local state until events run
  let asset_wallet = {}
  let uoa_wallet = {}

  onMount(async () => {
    console.log("onMount");

    var el = document.getElementById('market_select_trigger');
    var instances2 = M.Dropdown.init(el, {
      alignment: 'left',
      coverTrigger: false,
      constrainWidth: false
    });

    makeBookChart();
    makeChart('chart');
  })

  $: if (process.browser) {
    console.log("proce ss.browser")

    lastMarket.set(market.name)
    user = JSON.parse(sessionStorage.getItem('user'))
    account_id = user.id


    runPolling()
  }

  function makeBookChart(){
    var ctx = document.getElementById("book_chart").getContext("2d");
    var maxYTick = 100

    var options = {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          yAxisID: 'buy-side',
          label: "Buy Amounts",
          backgroundColor: green,
          borderColor: green,
          borderWidth: 0,
          steppedLine: 'after',
          data: []
        },
        {
          yAxisID: 'sell-side',
          label: "Sell Amounts",
          backgroundColor: red,
          borderColor: red,
          borderWidth: 0,
          steppedLine: 'before',
          data: []
        }]
      },
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
    }
    chart = new Chart(ctx, options)

  }

  function fetchChart() {
    fetch(`/api/book?market_id=${market.id}`)
    .then(r => r.json())
    .then(data => {
      book_chart = {}

      var buy_prices = []
      var sell_prices = []
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
          buy_prices.push(element['price'])
        }
        else { // sell
          buy = 0
          sell = element['total']
          sell_prices.push(element['price'])
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

      chart.data.labels = prices;
      chart.data.datasets[0].data = amounts;
      chart.data.datasets[1].data = sell_amounts;

      quick_price['bid'] = buy_prices[buy_prices.length-1] || 0
      quick_price['ask'] = sell_prices[0] || 0

      function getMaxNumberFromArray(array) {
          return array.reduce((a, b) => Math.max(a, b));
      }

      const maxYTick = Math.max(
          getMaxNumberFromArray(amounts),
          getMaxNumberFromArray(sell_amounts)
      );

      //chart.options.data = book_chart;
      chart.options.scales.yAxes[0].ticks.max = maxYTick;
      chart.options.scales.yAxes[1].ticks.max = maxYTick;
      console.log("update book chart!")
      chart.update();

    });
  }

  function togglePolling() {
    polling_on = !polling_on;
    polling_expired = false;

    if (polling_on) {
      runPolling();
      pollingInterval = setInterval(() => { runPolling() }, 2*1000);
      pollingTimeout = setTimeout(() => { expirePolling() }, 15*60*1000); // 15 minutes
    }
    else {
      clearInterval(pollingInterval);
      clearTimeout(pollingTimeout);
    }
  }

  function expirePolling() {
    clearInterval(pollingInterval);
    polling_on = false;
    polling_expired = true
  }

  function runPolling() {
    polling_inprogress = 5;

    fetch(`/api/trade?per_page=30&order=id&market_id=${market.id}`)
    .then(r => r.json())
    .then(data => {
      all_trades = data.results;
      polling_inprogress -= 1;

      quick_price['last'] = all_trades[0]['price'] || 0
    });

    fetch(`/api/ohlc?interval=${interval}&market_id=${market.id}`)
    .then(r => r.json())
    .then(data => {
      polling_inprogress -= 1;
      updateChart(data);
    });

    fetchChart()

    fetch(`/api/last24/${market.id}`)
    .then(r => r.json())
    .then(data => {
      last24 = data;
      polling_inprogress -= 1;
    });

    // User specific stuff only needs to update when the user
    // submits events
    fetch(`/api/balance?account_id=${account_id}`)
    .then(r => r.json())
    .then(data => {
      data.forEach((d) => {
        if (market.asset.id == d['asset_id']){
          asset_wallet = d
        }
        else if (market.uoa.id == d['asset_id']){
          uoa_wallet = d
        }
      });
      polling_inprogress -= 1;
    });

    fetch(`/api/order?order=id.desc&status__in=open,partial&account_id=${account_id}`)
    .then(r => r.json())
    .then(data => {
      active_orders = data.results;
      polling_inprogress -= 1;
      fetchEvents()
    });

  }

  function fetchEvents() {
    fetch(`/api/event?order=id.desc&per_page=100&status=new&account_id=${account_id}`)
    .then(r => r.json())
    .then(data => {
      pending_events = data.results;
      processPendingEvents()
    });
  }

  function processPendingEvents() {
    var cancels = []
    var placed = []
    pending_events.forEach((e) => {
      if (e.method == 'cancel-order'){
        var body = JSON.parse(e.body)
        cancels.push(body['uuid'])
      }
      else if (e.method == 'place-order'){
        var body = JSON.parse(e.body)
        body['uuid'] = e['uuid']
        body['status'] = e['status']
        body['created'] = e['created']
        body['id'] = 0
        body['pending'] = true
        placed.push(body)
      }
    })

    active_orders.forEach((o) => {
      o['pending'] = false
      if (cancels.includes(o['uuid'])){
        o['pending'] = true
        o['status'] = 'cancel'
      }
    })
    // add new to top of list
    active_orders = placed.concat(active_orders)
    console.log("active_orders:",active_orders)
  }

  function selectPrice(what) {
    var price = document.getElementById('price')
    if (what == 'last'){
      price.value = quick_price['last']
    }
    else if (what == 'bid'){
      price.value = quick_price['bid']
    }
    else if (what = 'ask'){
      price.value = quick_price['ask']
    }
    price.focus()
  }

  function selectAmount(percent) {
    var price = document.getElementById('price')
    var amount = document.getElementById('amount')
    var total = document.getElementById('total')

    // if buy, percent of uoa
    if (side == 'buy'){
      total.value = uoa_wallet.balance * percent / 100
      amount.value = total.value / price.value
    }
    else {
    // if sell, percent of asset
      amount.value = asset_wallet.balance * percent / 100
      total.value = amount.value * price.value
    }
    amount.focus()
    total.focus()
  }

  async function handleSubmit(event) {
    console.log('market:'+market);
  }

  async function navigateMarket(m) {
    console.log('navigateMarket')
    goto(`/trade/${m}`)
  }

  async function handleOrderSubmit(e) {
    console.log("handleOrderSubmit")

    var fe = document.forms.order_form.elements;

    var event = {
      method: 'place-order',
      account_id: account_id,
      body: JSON.stringify({
        price: fe['price'].value,
        amount: fe['amount'].value,
        market_id: 1,
        account_id: account_id,
        side: side
      })
    }
    fetch(`/api/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
    .then(r => r.json())
    .then(data => {
      console.log('posted! data:',data)
    });

  }

  async function handleOrderCancel(order) {
    var event = {
      method: 'cancel-order',
      account_id: account_id,
      body: JSON.stringify({
        account_id: account_id,
        order_id: order.id,
        uuid: order.uuid
      })
    }
    fetch(`/api/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
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
            <a id="market_select_trigger" class="btn z-depth-0 dropdown-trigger" data-target="market_dropdown">
              <i class="{market.asset.icon} fa-fw"></i>
              {market.name}
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
          <span ><i class="fas fa-spinner fa-spin"></i> Polling..</span>
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
            <th class="right-align">Price</th>
            <th class="right-align">Amount</th>
            <th class="right-align">Bal</th>
            <th class="right-align">Cost</th>
            <th class="right-align">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each active_orders as o }
          <tr class:disabled={o.pending}>
            <td>
              <span class="mex-id-field">
              {#if o.uuid}
                { o.uuid.substring(0,8) }
              {:else}
                { o.id.toString().padStart(8, '0') }
              {/if}
              </span>
            </td>
            <td>{ formats.datetime(o.created) }</td>
            <td>
              <span class="badge white-text darken-2"
                class:me-sell={o.side === 'sell'}
                class:me-buy={o.side === 'buy'}
              >
              {#if o.type}
                {o.type}/{o.side}
              {:else}
                {o.side}
              {/if}
              </span>
            </td>
            <td class="right-align">{ formats.currency_usd(o.price) }</td>
            <td class="right-align">{ formats.number(o.amount) }</td>
            <td class="right-align">{ formats.number(o.balance) }</td>
            <td class="right-align">&dash;</td>
            <td class="right-align">
            {o.status}
            </td>
            <td class="right-align">
              <button disabled={o.pending} on:click={() => handleOrderCancel(o)} class="btn-small">Cancel</button>
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
        <button type="button" on:click={() => side = 'buy'}
          class="btn"
          class:green={side === 'buy'}
        >Buy</button>
        <button type="button" on:click={() => side = 'sell'}
          class="btn"
          class:red={side === 'sell'}
        >Sell</button>
      </div>
    </div>
    <div class="row">
        <div class="right-align col s12">
            <button type="button" class="btn-small" on:click={() => selectPrice('bid')}>Bid</button>
            <button type="button" class="btn-small" on:click={() => selectPrice('ask')}>Ask</button>
            <button type="button" class="btn-small" on:click={() => selectPrice('last')}>Last</button>
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
            <button type="button" class="btn-small" on:click={() => selectAmount(25)}>25%</button>
            <button type="button" class="btn-small" on:click={() => selectAmount(50)}>50%</button>
            <button type="button" class="btn-small" on:click={() => selectAmount(75)}>75%</button>
            <button type="button" class="btn-small" on:click={() => selectAmount(100)}>100%</button>
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

    <table>
      <tbody>
        <tr>
          <td></td>
          <td class="right-align">{market.uoa.symbol} Wallet</td>
          <td class="right-align">{market.asset.symbol} Wallet</td>
        </tr>
        <tr>
          <td>Balance</td>
          <td class="right-align">{uoa_wallet.balance}</td>
          <td class="right-align">{asset_wallet.balance}</td>
        </tr>
        <tr>
          <td>Reserved</td>
          <td class="right-align">{uoa_wallet.reserve}</td>
          <td class="right-align">{asset_wallet.reserve}</td>
        </tr>
        <tr>
          <td>Available</td>
          <td class="right-align">{uoa_wallet.balance - uoa_wallet.reserve}</td>
          <td class="right-align">{asset_wallet.balance - asset_wallet.reserve}</td>
        </tr>
      </tbody>
    </table>

    </div></div>

    <div class="row"><div class="col s12">
      <div class="card-panel mex-card-panel">
        <div class="card-title">Trade History</div>
      </div>

      {#if all_trades}
      <table>
        <thead>
          <tr>
            <th>Amt</th>
            <th>Price</th>
            <th class="right-align">Time</th>
          </tr>
        </thead>
        <tbody>
          {#each all_trades as o }
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

