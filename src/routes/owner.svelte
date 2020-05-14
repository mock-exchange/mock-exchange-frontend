<svelte:head>
  <title>owners</title>
</svelte:head>

<script>
  import { onMount } from "svelte";
  import { owner_name } from '../store.js'
  let owners;

  onMount(async () => {
    await fetch(`/api/owner`)
    .then(r => r.json())
    .then(data => {
      owners = data.results;
    });
  })

  function handleClick(m) {
    window.localStorage.setItem('owner_id', m.id);
    window.localStorage.setItem('owner_name', m.name);
    owner_name.set(m.name)
  }

  function handleSearch(form) {
    var q = '%' + document.forms.search_form.elements['q'].value + '%';
    fetch(`/api/owner?name__like=${q}`)
    .then(r => r.json())
    .then(data => {
      owners = data.results;
    });

  }
</script>

<h1>Owners</h1>

<form name="search_form" on:submit|preventDefault="{handleSearch}">
  <div class="row">
    <div class="col s12">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">search</i>
          <input type="text" name="q" id="autocomplete-input" class="autocomplete">
          <!-- <label for="autocomplete-input">Autocomplete</label> -->
        </div>
      </div>
    </div>
  </div>
</form>

{#if owners}
<div class="owner-list">
  {#each owners as market }
  <button class="card-body" on:click={handleClick(market)}>
    <h4 class="card-title">{market.name}</h4>
    <h5 class="card-subtitle">{market.title}</h5>
  </button>
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
