<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import { page } from "$app/state";

  let { children } = $props();
</script>

<Header hasFolio={page.data.pageMeta?.isArticle} />
<div class="main">
  {@render children?.()}
</div>

<style>
  .main {
    max-width: var(--layout-max-width);
    margin: 0 auto;
    padding: 0 0 var(--48px);
  }
</style>
