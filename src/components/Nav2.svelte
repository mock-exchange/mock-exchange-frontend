<script>
    import { onMount } from "svelte";
    import { owner_name } from '../store.js'


    export let segment;

    onMount(async () => {
        console.log("init nav..");
        owner_name.set(window.localStorage.getItem('owner_name'));

        //document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded');
            var elems = document.querySelectorAll('.sidenav');
            console.log('elems:',elems);
            var instances = M.Sidenav.init(elems);
        //});

    })

</script>

<style>

</style>

<nav>
    <div class="nav-wrapper">
        <!--
        <a href="#!" class="brand-logo">
            <img src="/logo.png" alt="Mock Exchange Logo" />
        </a>
        -->
        <a href="" data-target="mobile-menu" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul class="left hide-on-med-and-down">
            <li>
            <a href="#!" style="color:black;"><i class="material-icons left">repeat</i>MOCKEX</a>
            </li>

            <li class='{segment === "trade" ? "active" : undefined}'><a href="trade/BTCUSD">Trade</a></li>
            <li class='{segment === "account" ? "active" : undefined}'><a href="account">History</a></li>
            <li class='{segment === "market" ? "active" : undefined}'><a href="market">Markets</a></li>
        </ul>

        <ul class="right hide-on-med-and-down">
            <li class='{segment === "owner" ? "active" : undefined}'>
                <a href="owner"><i class="material-icons left">person</i>{$owner_name}</a>
            </li>
        </ul>

    </div>
</nav>

<ul class="sidenav" id="mobile-menu">
    <li>
        <a href="#!" style="color:black;"><i class="material-icons left">repeat</i>MOCKEX</a>
    </li>
    <li><a href="trade/BTCUSD">Trade</a></li>
    <li><a href="account">History</a></li>
    <li><a href="market">Markets</a></li>
    <li><a href="owner"><i class="material-icons left">person</i>{$owner_name}</a></li>
</ul>

