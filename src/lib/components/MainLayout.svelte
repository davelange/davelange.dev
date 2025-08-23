<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    sidebarSlot,
    children
  }: { sidebarSlot: Snippet; children: Snippet } = $props();
</script>

<div class="wrapper">
  {@render sidebarSlot?.()}

  <div class="main">
    {@render children?.()}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    gap: var(--48px);
    /* flex: 1 0 auto; */
  }

  .main {
  }
</style>
