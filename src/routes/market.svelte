<svelte:head>
	<title>Markets</title>
</svelte:head>

<script>
    console.log("markets script tag");
    import { onMount } from "svelte";

    let assets;
    let markets;

    onMount(async () => {
        console.log("markets fetch");
        fetch(`/api/market`)
        .then(r => r.json())
        .then(data => {
            markets = data;
        });
        fetch(`/api/asset`)
        .then(r => r.json())
        .then(data => {
            assets = data;
        });

    })
</script>

<div class="collection">
        <a href="#!" class="collection-item">Alvin</a>
        <a href="#!" class="collection-item active">Alvin</a>
        <a href="#!" class="collection-item">Alvin</a>
        <a href="#!" class="collection-item">Alvin</a>
      </div>


  <div class="row">
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Card Title</span>
          <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
        </div>
        <div class="card-action">
          <a href="#">This is a link</a>
          <a href="#">This is a link</a>
        </div>
      </div>
    </div>
  </div>
            

  <ul class="pagination">
    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
    <li class="active"><a href="#!">1</a></li>
    <li class="waves-effect"><a href="#!">2</a></li>
    <li class="waves-effect"><a href="#!">3</a></li>
    <li class="waves-effect"><a href="#!">4</a></li>
    <li class="waves-effect"><a href="#!">5</a></li>
    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
  </ul>
           


      <table>
        <thead>
          <tr>
              <th>Name</th>
              <th>Item Name</th>
              <th>Item Price</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Alvin</td>
            <td>Eclair</td>
            <td>$0.87</td>
          </tr>
          <tr>
            <td>Alan</td>
            <td>Jellybean</td>
            <td>$3.76</td>
          </tr>
          <tr>
            <td>Jonathan</td>
            <td>Lollipop</td>
            <td>$7.00</td>
          </tr>
        </tbody>
      </table>


<h1>Markets</h1>


{#if markets}
  {#each markets as market }
    <ul>
      <li>
        {market.name}
      </li>
    </ul>
  {/each}
{:else}
  <p class="loading">loading...</p>
{/if}


<h1>Assets</h1>

{#if assets}
  {#each assets as asset }
    <ul>
      <li>
        {asset.name}
      </li>
    </ul>
  {/each}
{:else}
  <p class="loading">loading...</p>
{/if}

