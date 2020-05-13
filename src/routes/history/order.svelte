<svelte:head>
    <title>Order History</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { owner_name } from '../../store.js'

    import querystring from 'querystring';
    import { goto, stores } from '@sapper/app';
    import Pagination from '../../components/Pagination.svelte';

    import formats from '../../formats.js'

    let user_id;
    let results;


    let parsed;

    const { page } = stores();
    const { host, path, params, query } = $page;

    let total;

    onMount(async () => {
    
    })

    // This runs when the route changes
    $: if (process.browser) {
        if (!query.page){
            query.page = 1
        }
        if (!query.per_page){
            query.per_page = 10
        }

        user_id = window.localStorage.getItem('owner_id');
        var api_query = Object.assign({}, query);
        api_query.owner = user_id
        api_query.status__notin = 'open,partial'

        var qs = querystring.stringify(api_query)

        fetch(`/api/order?${qs}`)
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

<h3>Order History</h3>

{#if results}
<table>
  <thead>
    <tr>
      <th>Order</th>
      <th>Created</th>
      <th>Market</th>
      <th>Type</th>
      <th class="right-align">Price</th>
      <th>Amt</th>
      <th>Amt Left</th>
      <th>Balance</th>
      <th class="right-align">Status</th>
    </tr>
  </thead>
  <tbody>
    {#each results as r }
    <tr>
      <td>{ r.id }</td>
      <td>{ formats.datetime(r.created) }</td>
      <td>{ r.market.name }</td>
      <td><span class="badge white-text" class:red={r.direction == 'sell'} class:green={r.direction == 'buy'}>{r.direction }/{ r.type }</span></td>
      <td class="right-align">{ formats.currency_usd(r.price) }</td>
      <td>{ r.amount }</td>
      <td>{ r.amount_left }</td>
      <td>{ r.balance }</td>
      <td class="right-align">{ r.status }</td>
    </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}

<Pagination page={query.page} per_page={query.per_page} total={total} on:changed={pageChanged}/>

