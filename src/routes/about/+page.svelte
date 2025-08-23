<script lang="ts">
  import Header from "$lib/components/Header.svelte";

  const path = "../../content/about.svx";

  const post = import(path);
</script>

{#snippet nav()}
  <span></span>
{/snippet}

{#snippet main()}
  <div class="body prose">
    {#await post}
      <span>Loading...</span>
    {:then post}
      <post.default />
    {/await}
  </div>
{/snippet}

<Header />
<div class="main">
  <!--  -->
  <!-- <ListingLayout navSlot={nav} mainSlot={main} /> -->
  {#await post then post}
    <div class="body">
      <post.default />
    </div>
  {/await}
</div>

<style>
  .main {
    max-width: var(--layout-max-width);
    margin: 0 auto;
    padding: 0 0 var(--48px);
  }

  .body {
    max-width: 50ch;
    margin: 0 auto;
  }
</style>
