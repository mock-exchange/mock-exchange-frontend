<svelte:head>
  <title>Login</title>
</svelte:head>
<script>
  import { goto, stores } from '@sapper/app'
  import { onMount } from "svelte";
  import autocomplete from 'autocompleter';

  const { session } = stores()

  let selected = {}
  let recent_users = []

  onMount(async () => {

    var input = document.getElementById("login");

    var users = localStorage.getItem('recent_users')
    if (users){
      recent_users = JSON.parse(users).reverse().slice(0,5)
    }

    /*
    var more_qty = 5 - recent_users.length

    if (more_qty > 0){
      fetch(`/api/account?per_page=${more_qty}`)
      .then(r => r.json())
      .then(data => {
        recent_users.push(data.results)
      })
    }
    */

    autocomplete({
      input: input,
      emptyMsg: 'No users found',
      debounceWaitMs: 700,
      showOnFocus: true,
      //preventSubmit: true,
      fetch: (text, update) => {
        // If text changed, clear selected
        console.log("text:",text, " len:", Object.keys(selected).length);
        if (Object.keys(selected).length && selected['name'] != text){
          console.log("CLEAR!")
          selected = {}
        }

        text = '%' + text.toLowerCase() + '%';
        // you can also use AJAX requests instead of preloaded data
        fetch(`/api/account?per_page=20&name__like=${text}`)
        .then(r => r.json())
        .then(data => {
          var suggestions = []
          data.results.forEach((user, i) => {
            // var u = Object.assign({}, user)
            var u = { ...user }
            u['index'] = i
            u['label'] = user.name
            suggestions.push(u)
          })
          update(suggestions);
        });
      },
      onSelect: function(item) {
        selected = item;
        input.value = item.name;
        console.log("onSelect selected:",selected);
      },
      customize: function(input, inputRect, container, maxHeight) {
        container.style.maxHeight = "20em";
      }

    });

  })

  async function login () {
    var input = document.getElementById("login");
    if (Object.keys(selected).length){
      console.log("OK to do login selected:",selected);
      sessionStorage.setItem('user', JSON.stringify(selected))
      addUserToRecents(selected)
      goto('/')
    }
  }

  function addUserToRecents (user) {
    var users = localStorage.getItem('recent_users')
    if (!users){ users = [] }
    else { users = JSON.parse(users) }

    var remove;
    users.forEach((u, i) => {
      if (u.id == user.id){
        remove = i
      }
    })
    if (remove){
      users.splice(remove,1)
    }

    users.push(user)
    if (users.length > 10){ users.shift() }
    localStorage.setItem('recent_users', JSON.stringify(users))
  }

</script>

<style>
.collection-item {
  cursor: pointer;
}
.collection-item.avatar {
  min-height: 0;
}
.card {
  margin-top: 50px;
}
.card-panel h1 {
  margin-top: 0;
}
</style>


<form name="login_form" on:submit|preventDefault={login}>
  <div class="card">

    <div class="card-content">
      <span class="card-title mex-primary-text-color">MEX Login</span>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" name="login" id="login" />
          <label for="login">Username</label>
        </div>
      </div>

      {#if recent_users}
        <ul class="collection">
          {#each recent_users as u }
          <li class="collection-item avatar" class:active={selected.id === u.id} on:click={() => selected = u}>
            <img src="/foo{u.picture}" alt="" class="circle">
            <span class="title">{u.name}</span>
            <p>{u.email}</p>
            <span class="secondary-content"><i class="material-icons">grade</i></span>
          </li>
          {/each}
        </ul>
      {:else}
        <p class="loading">loading...</p>
      {/if}

    </div>

    <div class="card-action row">
      <button class="btn col s12 mex-primary-color">Login</button>
    </div>

  </div>
</form>

