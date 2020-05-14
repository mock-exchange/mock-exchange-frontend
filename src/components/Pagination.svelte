<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from 'svelte';

  export let total;
  export let page;
  export let per_page;

  const dispatch = createEventDispatcher();

  const window_size = 5 /* Choose odd number */
  const window_half = Math.floor(window_size / 2)

  let pages = []
  let max_page

  $: max_page = Math.ceil(parseInt(total) / parseInt(per_page))
  $: has_prev = parseInt(page) > 1;
  $: has_next = max_page > parseInt(page);

  function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  $: if (total === undefined){
    pages = [1]
  }
  else if (max_page < window_size){
    pages = range(max_page, 1)
  }
  else if (parseInt(page) <= window_half + 1){
    pages = range(window_size, 1)
  }
  else if (parseInt(page) >= max_page - window_half){
    pages = range(window_size, (max_page - window_size) + 1)
  }
  else {
    pages = range(window_size, page - window_half)
  }

  /*
  function has_prev() {
    return parseInt(page) > 1
  }

  function has_next() {
    return Math.ceil(parseInt(total) / parseInt(per_page)) > parseInt(page)
  }
  */

  function prev() {
    if (!has_prev){ return; }
    dispatch('changed', {
      page: parseInt(page) - 1
    });
  }

  function next() {
    if (!has_next){ return; }
    dispatch('changed', {
      page: parseInt(page) + 1
    });
  }

  function gopage(pg) {
    dispatch('changed', {
      page: pg
    });
  }


</script>

<style>
.col > div {
  margin: 1em;
  text-align: right;
}
</style>

<div class="row">
<div class="col m6">
<ul class="pagination">
  <li class="waves-effect" class:disabled={!has_prev}><a on:click={prev}><i class="material-icons">chevron_left</i></a></li>
  {#each pages as pg}
  <li class="waves-effect" class:active={pg == page}><a on:click={() => gopage(pg)}>{pg}</a></li>
  {/each}
  <li class="waves-effect" class:disabled={!has_next}><a on:click={next}><i class="material-icons">chevron_right</i></a></li>
</ul>
</div>

<div class="col m6"><div>
  { page } of { max_page } pages
</div></div>
</div>
