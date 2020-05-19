<script>
  import { goto, stores } from '@sapper/app'
  import { onMount } from "svelte";
  import { user } from '../../auth.js'

  const { session } = stores()
  let inProgress = false
  let error = null

  let owners

  onMount(async () => {
    await fetch(`/api/owner`)
    .then(r => r.json())
    .then(data => {
      owners = data.results;
    });
  })

  function handleSearch(form) {
    var q = '%' + document.forms.search_form.elements['q'].value + '%';
    fetch(`/api/owner?name__like=${q}`)
    .then(r => r.json())
    .then(data => {
      owners = data.results;
    });
  }

  function handleClick(owner) {
    console.log("owner:",owner)
    user.set(owner)
    console.log("user:",user)

    sessionStorage.setItem('user', JSON.stringify(owner))
    goto('/')
    //var user = JSON.parse($window.sessionStorage.user);
  }


  async function submit () {
    console.log('SUBMIT!')
    try {
      inProgress = true
      const response = await fetch.post('/auth/login', user)
      $session.user = response.data
      inProgress = false
      error = null
      //user = { username: '', password: '' }
      goto('/')
    } catch (err) {
      error = err.response.data.message
      inProgress = false
    }
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>
<!--
<form
  class="login-form"
  on:submit|preventDefault="{submit}"
>
  {#if error}
    <span class="error-message">
      {error}
    </span>
  {/if}
  <input
    class="text-input username-input"
    bind:value="{user.username}"
    type="text"
    placeholder="username"
    required
  >
  <input
    class="text-input password-input"
    bind:value="{user.password}"
    type="password"
    placeholder="password"
    required
  >
  <button
    class="login-button primary-button"
    disabled="{inProgress}"
  >
    LOG IN
  </button>
</form>
-->

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
