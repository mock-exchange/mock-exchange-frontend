<svelte:head>
    <title>Order History</title>
</svelte:head>

<script>
  import { onMount } from "svelte";

  import querystring from 'querystring';
  import { goto, stores } from '@sapper/app';
  import Pagination from '../../components/Pagination.svelte';
  import OrdersTable from '../../components/OrdersTable.svelte';
  import LedgerTable from '../../components/LedgerTable.svelte';

  import formats from '../../formats.js'

  let account_id;
  let results;

  let parsed;

  const { page } = stores();
  const { host, path, params, query } = $page;

  let total;

  let user

  export let segment

  // This runs when the route changes
  $: if (process.browser) {
    if (!query.page){
      query.page = 1
    }
    if (!query.per_page){
      query.per_page = 10
    }

    user = JSON.parse(sessionStorage.getItem('user'));
    console.log("xx user:",user);
    account_id = user.id
    console.log("account_id:",account_id);

    var api_query = Object.assign({}, query);
    api_query.account_id = account_id
    api_query.status__notin = 'open'
    api_query.order = 'id.desc'

    var qs = querystring.stringify(api_query)


    fetch(`/api/${segment}?${qs}`)
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

<h1>{segment} History</h1>

{#if results}
  <LedgerTable rows={results} />
{:else}
  <p class="loading">loading...</p>
{/if}

<Pagination page={query.page} per_page={query.per_page} total={total} on:changed={pageChanged}/>

