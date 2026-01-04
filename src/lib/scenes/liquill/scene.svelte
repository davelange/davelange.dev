<script lang="ts">
  import { onMount } from "svelte";
  import { createScene } from "./main.svelte";
  import type { SceneButtonSlot } from "../index.svelte";

  let {
    sceneButtonSlot
  }: {
    sceneButtonSlot?: SceneButtonSlot;
  } = $props();

  const scene = createScene({
    onMount
  });
</script>

<div class="scene-overlay"></div>
<canvas class="webgl"> </canvas>
{@render sceneButtonSlot?.({
  onClick: () => scene?.toggleEditScene()
})}

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
