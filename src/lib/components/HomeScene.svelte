<script lang="ts">
  import { type Component } from "svelte";
  import SceneWrapper from "$lib/scenes/SceneWrapper.svelte";

  let sceneIdx = $state(0);

  const scenes = [
    { id: "lake", name: "Lake" },
    { id: "glow", name: "Glow" }
  ] as const;

  let currentScene = $derived(scenes[sceneIdx % scenes.length]);

  let RenderedComponent = $derived.by<Promise<Component>>(
    async () => {
      const module = await import(
        `$lib/scenes/${currentScene.id}/scene.svelte`
      );
      return module.default;
    }
  );

  function nextScene() {
    sceneIdx++;
  }
</script>

<SceneWrapper sceneName={currentScene.name} {nextScene}>
  {#await RenderedComponent then Res}
    <Res />
  {/await}
</SceneWrapper>
