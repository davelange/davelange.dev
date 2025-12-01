<script lang="ts">
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Header from "$lib/components/Header.svelte";
  import { onMount } from "svelte";
  import { createScene } from "$lib/scenes/glow/main.svelte";

  createScene({
    onMount,
    showGui: false
  });
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
    <Header />
  {/snippet}

  <div class="wrapper">
    <div class="scene-overlay"></div>
    <canvas class="webgl"> </canvas>
  </div>
</MainLayout>

<style>
  .wrapper {
    position: relative;
    display: flex;

    width: 100%;
    height: 100%;
    max-width: 90vmin;
    max-height: 90vmin;

    border-radius: 4px;
    overflow: hidden;
    aspect-ratio: 1;

    box-shadow: -4px 10px 16px #d57d7d22;
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  :global(html.dark) .wrapper {
    box-shadow: -4px 10px 16px #23242722;
  }

  .webgl {
    position: absolute;
    margin: auto;
    z-index: 1;
  }
</style>
