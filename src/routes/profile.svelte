<svelte:head>
  <title>Profile</title>
</svelte:head>

<script>
  import { onMount } from "svelte";
  import formats from '../formats.js';
  import { goto, stores } from '@sapper/app';

  let user = {}
  let balances;

  onMount(() => {

    user = JSON.parse(sessionStorage.getItem('user'))

    fetch(`/api/balance?account_id=${user.id}`)
    .then(r => r.json())
    .then(data => {
        balances = data;
    });
  })

  function deposit(i) {
    var b = balances[i]
    // Increase fake balance by $10k worth
    var amount = 10
    if (b.asset_id == 1){ // USD
      amount = 10000
    }
    else if (b.last_price){
      amount = (10000 / b.last_price).toFixed(10)
    }
    var event = {
      method: 'deposit',
      body: JSON.stringify({
        account_id: user.id,
        asset_id: b.asset_id,
        amount: amount
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
      balances[i].balance = parseFloat(b.balance) + parseFloat(amount);
      M.toast({html: 'Deposit of '+amount+' submitted!'});
    });
  }

  function withdraw(i) {
    var b = balances[i]
    // Drop fake balance by half
    var amount = (b.balance * .5).toFixed(10)
    var event = {
      method: 'withdraw',
      body: JSON.stringify({
        account_id: user.id,
        asset_id: b.asset_id,
        amount: amount
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
      balances[i].balance = b.balance - amount;
      M.toast({html: 'Withdraw of '+amount+' submitted!'});
    });
  }

</script>


<h1>Balances for {user.name}</h1>


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
    {#each balances as o, i}
    <tr>
      <td><i class="{o.icon} fa-2x fa-fw"></i> {o.name} ({o.symbol})</td>
      <td class="right-align">{ formats.number(o.balance, o.scale) }</td>
      {#if o.symbol === 'USD'}
        <td class="right-align">&dash;</td>
        <td class="right-align">{ formats.currency_usd(o.balance) }</td>
      {:else}
        <td class="right-align">{ formats.currency_usd(o.last_price) }</td>
        <td class="right-align">{ formats.currency_usd(o.last_price * o.balance) }</td>
      {/if}
      <td class="right-align">
        <button class="btn" on:click={() => deposit(i)}>Deposit</button>
        <button class="btn" on:click={() => withdraw(i)}>Withdraw</button>
      </td>
    </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}


