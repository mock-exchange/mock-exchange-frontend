<script>
  import Nav from '../components/Nav.svelte';
  import Footer from '../components/Footer.svelte';

  export let segment;
</script>

<style>
</style>

<header>
  <Nav {segment}/>
</header>

<main>
  <div class="container">
    <slot></slot>
  </div>
</main>

<!-- <Footer /> -->
