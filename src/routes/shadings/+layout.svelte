<script lang="ts">
  import { page } from "$app/state";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import SidebarHeader from "$lib/components/SidebarHeader.svelte";
  import {
    getSceneById,
    type SceneId
  } from "$lib/scenes/index.svelte";
  import SceneWrapper from "$lib/scenes/SceneWrapper.svelte";
  import { resolve } from "$app/paths";
  import { scenes } from "$lib/scenes/index.svelte";

  let { children } = $props();

  let currentScene = $derived(
    getSceneById(page.params.slug || "lakes")
  );
</script>

<svelte:head>
  <title>{currentScene?.name} | Dave Lange</title>
  <meta
    name="description"
    content="Experiments with shaders and all that"
  />
</svelte:head>

<MainLayout>
  {#snippet sidebarSlot()}
    <Sidebar>
      {#snippet topSlot()}
        <SidebarHeader />
      {/snippet}

      {#snippet bottomSlot()}
        <div class="scene-list">
          {#each scenes as scene (scene.id)}
            <a
              href={resolve(`/shadings/${scene.id}`)}
              class:active={scene.id === page.params.slug}
            >
              {scene.name}
            </a>
          {/each}
        </div>
      {/snippet}
    </Sidebar>
  {/snippet}

  {#if currentScene}
    <SceneWrapper scene={page.params.slug as SceneId} withRouting />
  {/if}

  <ListingLayout>
    {#snippet mainSlot()}
      {@render children()}
    {/snippet}
  </ListingLayout>
</MainLayout>

<style>
  .scene-list {
    display: flex;
    flex-direction: column;
    gap: var(--8px);

    a {
      font-size: var(--14px);
      text-decoration: none;
      color: var(--fg-neutral-mild);

      &:hover,
      &:focus,
      &.active {
        color: var(--fg-brand-mild);
      }
    }
  }
</style>
