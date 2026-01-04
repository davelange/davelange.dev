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
    </Sidebar>
  {/snippet}

  {#if currentScene}
    <SceneWrapper
      initialScene={currentScene.id as SceneId}
      withRouting
    />
  {/if}

  <ListingLayout>
    {#snippet mainSlot()}
      {@render children()}
    {/snippet}
  </ListingLayout>
</MainLayout>
