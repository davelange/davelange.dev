<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/styles/reset.css";
  import "$lib/styles/global.css";
  import "$lib/styles/prism.css";
  import Header from "$lib/components/Header.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>davelange.dev</title>
</svelte:head>

<Header />
<div class="main">
  {@render children?.()}
</div>

<style>
  :global(body) {
    background: var(--bg-neutral-default);
  }

  .main {
    max-width: var(--layout-max-width);
    margin: 0 auto;
    padding: 0 0 var(--48px);
  }
</style>
