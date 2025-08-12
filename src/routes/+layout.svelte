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

{@render children?.()}

<!-- <style>
  :global(body) {
    background: var(--bg-neutral-default);
  }
</style> -->
