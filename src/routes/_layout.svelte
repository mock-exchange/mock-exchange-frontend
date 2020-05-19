<script>
  import Nav from '../components/Nav.svelte';
  import Footer from '../components/Footer.svelte';
  import { goto, stores } from '@sapper/app';
  import { onMount } from "svelte";

  const { page, preloading, session } = stores();
  export let segment;

  let authed = false
  export async function preload(page) {
  }

  if (segment != 'auth' && typeof window !== "undefined" && typeof document !== "undefined") {
    console.log("[_layout] setting page.subscribe")
    page.subscribe(({ path, params, query }) => {
      // do amazing things
      console.log("[_layout] page.subscribed() called")
      if (!window.sessionStorage.getItem('user')){
        authed = false
        console.log("[_layout] authed:",authed," segment:",segment)
        // DO NOT goto() for auth paths or bad things will happen.
        if (segment != 'auth'){
          goto('/auth/login')
        }
      }
      else {
        authed = true
      }

    })

  }

  onMount(async () => {
    console.log("_layout !!! onMount")
  })

</script>

<style lang="scss" global>
  @import "../style/global.scss";
</style>

{#if segment == 'auth'}
  <h1>Login layout biatch!</h1>
  <main>
    <div class="container">
      <slot></slot>
    </div>
  </main>
{:else if authed}
  <header>
    <Nav {segment}/>
  </header>

  <main>
    <div class="container">
      <slot></slot>
    </div>
  </main>
  <h1>Message: authed:{authed}</h1>
<!-- <Footer /> -->
{/if}
