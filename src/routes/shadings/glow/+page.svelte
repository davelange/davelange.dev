<script lang="ts">
  import MainLayout from "$lib/components/MainLayout.svelte";
  import GlowScene from "$lib/scenes/glow/scene.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import SidebarHeader from "$lib/components/SidebarHeader.svelte";
  import SceneWrapper from "$lib/scenes/SceneWrapper.svelte";
</script>

<svelte:head>
  <title>Glow | Dave Lange</title>
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

  <SceneWrapper>
    <GlowScene />
  </SceneWrapper>
</MainLayout>
