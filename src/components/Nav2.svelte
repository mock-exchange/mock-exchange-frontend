<script>
    import { onMount } from "svelte";
    import { owner_name } from '../store.js'


    export let segment;

    onMount(async () => {
        console.log("init nav..");
        owner_name.set(window.localStorage.getItem('owner_name'));

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
        <ul class="left hide-on-med-and-down">
            <li>
            <a href="#!" style="color:black;"><i class="material-icons left">repeat</i>MOCKEX</a>
            </li>

            <li class='{segment === "trade" ? "active" : undefined}'><a href="trade/BTCUSD">Trade</a></li>
            <li class='{segment === "account" ? "active" : undefined}'><a href="account">Account</a></li>
            <li class='{segment === "market" ? "active" : undefined}'><a href="market">Markets</a></li>
        </ul>

        <ul class="right hide-on-med-and-down">
            <li class='{segment === "owner" ? "active" : undefined}'>
                <a href="owner"><i class="material-icons left">person</i>{$owner_name}</a>
            </li>
        </ul>

    </div>
</nav>

