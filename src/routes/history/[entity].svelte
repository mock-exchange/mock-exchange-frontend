<svelte:head>
    <title>Order History</title>
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

  let user;
  let results;


  // Pagination
  let total

  let entity
  let entity_obj


  let path
  let params
  let query


  const { page } = stores()

  let unsubscribe

  if (typeof window !== "undefined" && typeof document !== "undefined") {

    console.log('page.subscribe()')
    unsubscribe = page.subscribe((p) => {
      console.log('subscribe path:', p.path, ', params:',p.params, ', query:',p.query);
      params = p.params;
      query = p.query

      entity = params.entity
      entity_obj = entities[entity]
      onPageChange()

    });

  }

  onMount(async () => {
    console.log("onMount");
  })

  onDestroy(() => { unsubscribe(); console.log('unsubscribe'); });

  /*
    const { page } = stores()
    path = $page.path;
    params = $page.params;
    query = $page.query;
  */

  function onPageChange() {

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

</script>

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

