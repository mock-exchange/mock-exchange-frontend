<script context="module">

  console.log("init module")

  export async function preload(page) {

    console.log("init module in reload")
    if (!sessionStorage.getItem('user')){
      goto('/auth/login')
    }
  }

</script>

