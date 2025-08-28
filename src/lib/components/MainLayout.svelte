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
    gap: var(--24px);
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row;
      gap: var(--128px);
    }
  }
</style>
