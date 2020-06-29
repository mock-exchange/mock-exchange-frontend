<svelte:head>
    <title>{entity.title}</title>
</svelte:head>

<script>
  import { onMount, onDestroy } from "svelte";
  import { goto, stores } from '@sapper/app';

  import querystring from 'querystring';

  import Pagination from '../../components/Pagination.svelte';
  import OrderTable from '../../components/OrderTable.svelte';
  import TradeTable from '../../components/TradeTable.svelte';
  import LedgerTable from '../../components/LedgerTable.svelte';

  import formats from '../../formats.js'

  const config = {
    order: {
      title: 'Orders',
      base_url: '/api/order',
      api_params: {
        'status__notin': 'open'
      }
    },
    trades: {
      title: 'Trades',
      base_url: '/api/trade_side'
    },
    ledger: {
      title: 'Ledger',
      base_url: '/api/ledger'
    }
  }

  let user

  // Pagination
  let total
  let results

  let entity_name
  let entity = {}

  let page
  let query

  $: if (process.browser) {
    page = stores().page
    query = $page.query

    entity_name = $page.params.entity_name
    entity = config[entity_name]

    user = JSON.parse(sessionStorage.getItem('user'));

    if (!query.page){
      query.page = 1
    }
    if (!query.per_page){
      query.per_page = 10
    }

    var api_query = Object.assign({}, query);
    api_query.account_id = user.id
    api_query.order = 'id.desc'

    if ('api_params' in entity){
      Object.keys(entity['api_params']).forEach((k) => {
        api_query[k] = entity['api_params'][k]
      })
    }

    var qs = querystring.stringify(api_query)

    results = undefined
    var url = entity.base_url
    fetch(`${url}?${qs}`)
    .then(r => r.json())
    .then(data => {
      results = data.results;
      total = data.pagination.total;
    });
  }

  function pageChanged(event) {
    query.page = event.detail.page
    var qs = querystring.stringify(query)

    goto(`${$page.path}?${qs}`);
  }

</script>

<h1>{entity.title}</h1>

{#if results}
  {#if entity_name == 'order'}
    <OrderTable rows={results} />
  {:else if entity_name == 'trades'}
    <TradeTable rows={results} />
  {:else if entity_name == 'ledger'}
    <LedgerTable rows={results} />
  {/if}
{:else}
  <p class="loading">loading...</p>
{/if}

<Pagination page={query.page} per_page={query.per_page} total={total} on:changed={pageChanged}/>

