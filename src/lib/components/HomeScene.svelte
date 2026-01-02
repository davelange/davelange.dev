<script lang="ts">
  import { type Component } from "svelte";
  import SceneWrapper from "$lib/scenes/SceneWrapper.svelte";

  let sceneIdx = $state(0);

  const scenes = [
    "../../lib/scenes/lake/scene.svelte",
    "../../lib/scenes/glow/scene.svelte"
  ];

  let RenderedComponent = $derived.by<Promise<Component>>(
    async () => {
      const module = await import(scenes[sceneIdx % scenes.length]);
      return module.default;
    }
  );
</script>

<SceneWrapper>
  {#await RenderedComponent then Res}
    <Res />
  {/await}
</SceneWrapper>
