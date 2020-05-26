<svelte:head>
    <title>Order History</title>
</svelte:head>

<script>
  import { onMount } from "svelte";

  import querystring from 'querystring';
  import { goto, stores } from '@sapper/app';
  import Pagination from '../../components/Pagination.svelte';
  import OrderTable from '../../components/OrderTable.svelte';
  import TradeTable from '../../components/TradeTable.svelte';
  import LedgerTable from '../../components/LedgerTable.svelte';

  import formats from '../../formats.js'

  let account_id;
  let results;

  let parsed;

  const entities = {
    order: {
      title: 'Orders',
      base_url: '/api/order',
      api_params: {
        'status__notin': 'open'
      }
    },
    trades: {
      title: 'Trades',
      base_url: '/api/trade'
    },
    ledger: {
      title: 'Ledger',
      base_url: '/api/ledger'
    }
  }


  let total

  let user
  let entity

  let entity_obj

  /*
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    page.subscribe(({ path, params, query }) => {
      console.log("page.subscribe path:",path," params:",params)
      entity = params.entity
      entity_obj = entities[entity]
      onPageChange()
    })
  }
  */


  let path
  let params
  let query
  let page

  onMount(async () => {
    console.log("onMount");
  })


  // This runs when the route changes
  $: if (process.browser) {
    page = stores().page

    path = $page.path;
    params = $page.params;
    query = $page.query;

    console.log("pro cess.browser path:",path," params:",params)
    entity = params.entity
    entity_obj = entities[entity]
    onPageChange()
  }

  function onPageChange() {

    if (!query.page){
      query.page = 1
    }
    if (!query.per_page){
      query.per_page = 10
    }

    user = JSON.parse(sessionStorage.getItem('user'));
    account_id = user.id

    var api_query = Object.assign({}, query);
    api_query.account_id = account_id
    api_query.order = 'id.desc'

    if ('api_params' in entity_obj){
      Object.keys(entity_obj['api_params']).forEach((k) => {
        api_query[k] = entity_obj['api_params'][k]
      })
    }

    var qs = querystring.stringify(api_query)

    results = undefined
    var url = entities[entity].base_url
    fetch(`${url}?${qs}`)
    .then(r => r.json())
    .then(data => {
      results = data.results;
      total = data.pagination.total;
    });
  }

  function pageChanged(event) {
    console.log('pageChanged() page:' + event.detail.page)
    query.page = event.detail.page
    var qs = querystring.stringify(query)

    goto(`${path}?${qs}`);
  }

  const xxnext = () => {
    goto(`my-table?p=${$page.query.p + 1}`);
  }
</script>

<style>

</style>

<h1>{entities[entity].title}</h1>

{#if results}
  {#if entity == 'order'}
    <OrderTable rows={results} />
  {:else if entity == 'trades'}
    <TradeTable rows={results} />
  {:else if entity == 'ledger'}
    <LedgerTable rows={results} />
  {/if}
{:else}
  <p class="loading">loading...</p>
{/if}

<Pagination page={query.page} per_page={query.per_page} total={total} on:changed={pageChanged}/>

