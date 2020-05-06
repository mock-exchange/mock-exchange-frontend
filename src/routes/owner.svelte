<svelte:head>
	<title>owners</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { owner_name } from '../store.js'
    let owners;

    onMount(async () => {
        console.log("owners fetch");
        await fetch(`/api/owner`)
        .then(r => r.json())
        .then(data => {
            owners = data;
        });
    })

    function handleClick(m) {
        console.log('clicked id:'+m.id+' name:'+m.name)
        window.localStorage.setItem('owner_id', m.id);
        window.localStorage.setItem('owner_name', m.name);
        owner_name.set(m.name)
    }
</script>

<h1>Owners</h1>


{#if owners}
<div class="owner-list">
  {#each owners as market }
  <a class="card-body" on:click={handleClick(market)}>
    <h4 class="card-title">{market.name}</h4>
    <h5 class="card-subtitle">{market.title}</h5>
  </a>
  {/each}
</div>
{:else}
  <p class="loading">loading...</p>
{/if}


<style>
.owner-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.card-body {
    cursor: pointer;
    flex: 1 200px;
    border: 1px solid #ccc;
    margin: 1em;
    padding: 1em;
}
.card-body:hover {
    background-color: #ececec;
}

.card-title {
    font-weight: bold;
}
</style>
