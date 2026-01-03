<script lang="ts">
  import { onMount } from "svelte";
  import { createScene } from "$lib/scenes/glow/main.svelte";

  createScene({
    onMount
  });
</script>

<div class="scene-overlay"></div>
<canvas class="webgl"> </canvas>

<style>
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .webgl {
    position: absolute;
    margin: auto;
    z-index: 1;
  }
</style>
