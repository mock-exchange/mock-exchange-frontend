<script>
  import { onMount } from "svelte"

  export let segment

  let app_title = 'MOCKEX'
  let user = {}

  onMount(async () => {
    var u = sessionStorage.getItem('user')
    if (u){
      user = JSON.parse(u)
    }
    // This component only exists when "logged in" so we
    // don't need to do anything more than this.
    else {
      user = {name:"Error"}
    }

    var elems = document.getElementById('mobile-menu');
    var instances = M.Sidenav.init(elems);

    var el = document.getElementById('profile_drop_trigger');
    var instances2 = M.Dropdown.init(el, {
      alignment: 'right',
      coverTrigger: false
    });
  })
</script>

<!-- Dropdown Structure -->
<ul id="profile_dropdown" class="dropdown-content">
  <li><a href="profile">Profile</a></li>
  <li class="divider"></li>
  <li><a href="/auth/logout">Logout</a></li>
</ul>

<nav>
  <div class="nav-wrapper">
    <div class="container">
    <a href="" data-target="mobile-menu" class="sidenav-trigger"><i class="material-icons">menu</i></a>
    <ul class="left hide-on-med-and-down">
      <li><a href="" class="mex-brand-logo"><i class="material-icons left">repeat</i>{app_title}</a></li>
      <li class='{segment === "trade" ? "active" : undefined}'><a href="trade/BTCUSD">Trade</a></li>
      <li class='{segment === "history" ? "active" : undefined}'><a href="history/order">History</a></li>
      <li class='{segment === "market" ? "active" : undefined}'><a href="market">Markets</a></li>
    </ul>

    <ul class="right hide-on-med-and-down">
      <!-- Dropdown Trigger -->
      <li>
        <a id="profile_drop_trigger" data-target="profile_dropdown"><i class="material-icons left">person</i>{user.name}<i class="material-icons right">arrow_drop_down</i></a>
      </li>
    </ul>

    </div>
  </div>
</nav>

<ul class="sidenav" id="mobile-menu">
  <li>
      <a href="#!" style="color:black;"><i class="material-icons left">repeat</i>{app_title}</a>
  </li>
  <li><a href="trade/BTCUSD">Trade</a></li>
  <li><a href="account">History</a></li>
  <li><a href="market">Markets</a></li>
  <li><a href="owner"><i class="material-icons left">person</i>{user.name}</a></li>
</ul>

