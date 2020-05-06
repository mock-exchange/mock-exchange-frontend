<svelte:head>
	<title>Accounts</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { owner_name } from '../store.js'
    let markets;

    onMount(async () => {
        console.log("markets fetch");
        var id = window.localStorage.getItem('owner_id');

        await fetch(`/api/account?owner=` + id)
        .then(r => r.json())
        .then(data => {
            markets = data;
        });
    })

    function handleClick(m) {
        console.log('clicked id:'+m.id+' name:'+m.name)
        window.localStorage.setItem('owner_id', m.id);
        window.localStorage.setItem('owner_name', m.name);
        owner_name.set(m.name)
    }
</script>

<h1>Account Balances</h1>


{#if markets}
<table border=1>

<tbody>
  {#each markets as market }
  <tr>
    <td>{market.asset}</td>
    <td>{market.balance}</td>
  </tr>
  {/each}
</tbody>
</table>
{:else}
  <p class="loading">loading...</p>
{/if}


