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
    nav {
        background-color: white;
        width: 56em;
        margin: 0 auto;
        border-bottom: 1px solid rgba(54,153,218,0.1); /* #3699da */

        font-weight: 300;
        padding: 0;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    /* clearfix */
    ul::after {
        content: '';
        display: block;
        clear: both;
    }

    li {
        display: block;
        float: left;
    }

    li.right {
        float: right;
    }

    [aria-current] {
        position: relative;
        display: inline-block;
    }

    [aria-current]::after {
        position: absolute;
        content: '';
        width: calc(100% - 1em);
        height: 2px;
        background-color: rgba(30,112,199); /* #1e70c7; */
        display: block;
        bottom: -1px;
    }

    a {
        text-decoration: none;
        padding: 1em 0.5em;
        display: block;
    }

    nav a.nav_logo {
        padding-top: 0.6em;
        padding-bottom: 0;
    }

    nav a.nav_logo img {
        height: 2.2em;
        object-fit: fill;
    }
</style>

<nav>
    <ul>
        <li><a href="." class="nav_logo"><img src="/logo.png" alt="Mock Exchange Logo" /></a></li>
        <li><a aria-current='{segment === "trade" ? "page" : undefined}' href="trade">Trade</a></li>
        <li><a aria-current='{segment === "account" ? "page" : undefined}' href="account">Accounts</a></li>
        <li><a aria-current='{segment === "market" ? "page" : undefined}' href="market">Markets</a></li>
        <li class="right"><a aria-current='{segment === "owner" ? "page" : undefined}' href="owner">{$owner_name}</a></li>
    </ul>
</nav>
