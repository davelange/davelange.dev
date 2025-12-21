<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    topSlot,
    bottomSlot
  }: {
    topSlot?: Snippet;
    bottomSlot?: Snippet;
  } = $props();
</script>

<div class="sidebar">
  {@render topSlot?.()}
  {@render bottomSlot?.()}
</div>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      position: sticky;
      top: 0;
      bottom: var(--layout-y-padding);

      top: var(--layout-y-padding);
      min-width: 240px;
      height: calc(100vh - (var(--layout-y-padding) * 2));
      flex-direction: column;
      gap: var(--48px);
      max-height: min(100vh, 840px);
    }
  }
</style>
