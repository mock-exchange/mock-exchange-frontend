<svelte:head>
  <title>Profile</title>
</svelte:head>

<script>
  import { onMount } from "svelte";
  import formats from '../formats.js';
  import { goto, stores } from '@sapper/app';

  let balances;
  let owner_id;
  let owner_name;
  let owner = {};

  // This runs when the route changes
  $: if (process.browser) {

    owner_id = window.localStorage.getItem('owner_id');
    owner_name = window.localStorage.getItem('owner_name');

    fetch(`/api/owner/${owner_id}`)
    .then(r => r.json())
    .then(data => {
        owner = data;
    });

    fetch(`/api/balance?owner_id=${owner_id}`)
    .then(r => r.json())
    .then(data => {
        balances = data;
    });
  }

</script>


<h1>Profile</h1>


      <div class="col s12 m8 offset-m2 l6 offset-l3">
        <div class="card-panel grey lighten-5 z-depth-1">
          <div class="row valign-wrapper">
            <div class="col s2">
              <img src="/foo/{owner.picture}" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->
            </div>
            <div class="col s10">
              <span class="black-text">
                This is a square image. Add the "circle" class to it to make it appear circular.
              </span>
            </div>
          </div>
        </div>
      </div>



<h2>Balances for {owner_name}</h2>


{#if balances}
<table>
  <thead>
    <tr>
      <th>Asset</th>
      <th class="right-align">Balance</th>
      <th class="right-align">Last Price</th>
      <th class="right-align">Value</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#each balances as o }
    <tr>
      <td><i class="{o.icon} fa-2x fa-fw"></i> {o.name} ({o.symbol})</td>
      <td class="right-align">{ formats.number(o.balance) }</td>
      {#if o.symbol === 'USD'}
        <td class="right-align">&dash;</td>
        <td class="right-align">{ formats.currency_usd(o.balance) }</td>
      {:else}
        <td class="right-align">{ formats.currency_usd(o.last_price) }</td>
        <td class="right-align">{ formats.currency_usd(o.usd_value) }</td>
      {/if}
      <td class="right-align">
        <button class="btn">Deposit</button>
        <button class="btn">Withdraw</button>
      </td>
    </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}


