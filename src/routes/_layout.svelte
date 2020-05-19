<script>
  import Nav from '../components/Nav.svelte';
  import Footer from '../components/Footer.svelte';
  import { goto, stores } from '@sapper/app';

  const { page, preloading, session } = stores();

  export let segment;
  let authed = false

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    page.subscribe(({ path, params, query }) => {
      if (!window.sessionStorage.getItem('user')){
        authed = false
        // No ∞ loops
        if (segment != 'auth'){
          goto('/auth/login')
        }
      }
      else {
        authed = true
      }
    })
  }

</script>

<style lang="scss" global>
  @import "../style/global.scss";
</style>

{#if segment == 'auth'}
  <main>
    <div class="container login-container">
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
<!-- <Footer /> -->
{/if}
