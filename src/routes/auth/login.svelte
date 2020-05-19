<svelte:head>
  <title>Login</title>
</svelte:head>
<script>
  import { goto, stores } from '@sapper/app'
  import { onMount } from "svelte";

  const { session } = stores()
  let inProgress = false
  let error = null


  let owners
  let ac_timer
  let ac_list = []
  let ac_highlighted;
  let selected = {}

  onMount(async () => {

    /*
    var el = document.getElementById('login_autocomplete');
    var instances = M.Autocomplete.init(el, {
      onAutocomplete: () => {
        console.log("onAutocomplete");
      },
      data: {
        "Apple": null,
        "Microsoft": null,
        "Google": 'https://placehold.it/250x250'
      }
    });
    */

    await fetch(`/api/owner?per_page=5`)
    .then(r => r.json())
    .then(data => {
      owners = data.results;
    });
  })

  function autoComplete(form) {
    clearTimeout(ac_timer)
    ac_timer = setTimeout(() => {
      var q = '%' + document.forms.search_form.elements['q'].value + '%';
      fetch(`/api/owner?per_page=5&name__like=${q}`)
      .then(r => r.json())
      .then(data => {
        ac_list = data.results;

      });
    }, 750)
  }

  function navigate(e) {
    if (!ac_list.length){
      return
    }
    switch (e.keyCode) {
      case 13: // enter
        console.log("ac selected")
        selected = ac_list[ac_highlighted]
        ac_highlighted = undefined

        break;
      case 38: // up
        if (ac_highlighted === undefined){
          ac_highlighted = ac_list.length -1
        }
        else {
          ac_highlighted -= 1
        }

        if (ac_highlighted < 0){
          ac_highlighted = ac_list.length -1
        }

        console.log("key up:"+ac_highlighted)
        break;
      case 40: // down
        if (ac_highlighted === undefined){
          ac_highlighted = 0
        }
        else {
          ac_highlighted += 1
        }

        if (ac_highlighted > ac_list.length - 1){
          ac_highlighted = 0
        }


        console.log("key down:"+ac_highlighted)
        break;
    }

    if (ac_highlighted){
      document.getElementById('ac_dropdown').focus()
    }
  }

  function selectUser(u) {
    //var user = JSON.parse($window.sessionStorage.user);
    selected = u
  }


  async function submit () {
    if (selected){
      sessionStorage.setItem('user', JSON.stringify(selected))
      goto('/')
    }
  }
</script>

<style>
.collection {
}
.collection-item.avatar {
  min-height: 0;
}
.card-panel {
  margin-top: 50px;
}
.card-panel h1 {
  margin-top: 0;
}

.ac-dropdown {
  display: block;
  width: 384.5px;
  left: 11.25px;
  top: 46px;

  transform-origin: 0px 0px;
  opacity: 1;
  transform: scaleX(1) scaleY(1);

  /*
  height: 50px;
  */
}
.highlight {
  background-color: #ccc;
}
</style>

<div class="card-panel">

<h1>Login</h1>


<form name="search_form" on:submit|preventDefault="{submit}">
  <div class="row">
    <div class="col s12">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">search</i>
          <input type="text" name="q" id="login_autocomplete" class="autocomplete" on:keyup="{autoComplete}" on:keydown={navigate}>
          <label for="login_autocomplete">User</label>

          <ul id="ac_dropdown" class="autocomplete-content dropdown-content ac-dropdown" tabindex="0" on:keydown={navigate}>
            {#each ac_list as u, i}
            <li>
              <img src="/foo{u.picture}" class="left circle">
              <span class:highlight={i === ac_highlighted}>{i} {u.name}</span>
            </li>
            {/each}
          </ul>

        </div>
      </div>
    </div>
  </div>
</form>

{#if owners}
  <ul class="collection">
    {#each owners as u }
    <li class="collection-item avatar" class:active={selected.id === u.id} on:click={selectUser(u)}>
      <img src="/foo{u.picture}" alt="" class="circle">
      <span class="title">{u.name}</span>
      <p>{u.email}</p>
      <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
    </li>
    {/each}
  </ul>
{:else}
  <p class="loading">loading...</p>
{/if}

  <div class="card-action">
    <button
      class="btn mex-btn-primary"
      disabled="{inProgress}"
    >Login</button>
  </div>

</div>


