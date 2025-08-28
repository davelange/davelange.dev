<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/styles/reset.css";
  import "$lib/styles/global.css";
  import "$lib/styles/prism.css";
  import { themeManager } from "$lib/theme.svelte";

  let { children } = $props();

  themeManager.init();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>davelange.dev</title>
</svelte:head>

<div class="main">
  {@render children?.()}
</div>

<style>
  .main {
    max-width: var(--layout-max-width);
    margin: 0 auto;
    padding: 0 var(--layout-x-padding);

    @media (min-width: 768px) {
      padding: var(--layout-y-padding) var(--layout-x-padding);
    }
  }
</style>
