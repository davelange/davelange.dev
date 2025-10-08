<script lang="ts">
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Header from "$lib/components/Header.svelte";
  import { text } from "$lib/scene/config";
  import { onMount } from "svelte";
  import { createScene } from "$lib/scene/main.svelte";

  createScene({
    onMount
  });
</script>

<svelte:head>
  <title>Lakes | Dave Lange</title>
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
    <div class="scene-content">
      <div class="greeting-wrapper">
        <p class="greeting" data-js="greeting">
          {#each text.greeting.split("") as char, i (i)}
            <span class="hidden">{char}</span>
          {/each}
        </p>
      </div>
      <p class="subtitle" data-js="subtitle">
        {#each text.subtitle.split("") as char, i (i)}
          <span class="hidden">{char}</span>
        {/each}
      </p>
    </div>
  </div>
</MainLayout>

<style>
  .wrapper {
    position: relative;
    display: flex;

    width: 100%;
    height: 100%;
    max-width: 1000px;

    border-radius: 0.72rem;
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
  .scene-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-neutral-default);
    z-index: 3;
    animation: fadeOut 0.2s 0.3s ease-in-out forwards;
  }

  :global(html.dark) .wrapper {
    box-shadow: -4px 10px 16px #23242722;
  }

  .webgl {
    position: absolute;
    margin: auto;
    z-index: 1;
  }

  .scene-content {
    margin: auto;
    width: fit-content;
    text-wrap: balance;
    color: #ffffff;
    z-index: 2;
    text-align: center;
    font-family: var(--font-mono);
    letter-spacing: 2px;

    .greeting {
      font-size: var(--52px);
      font-weight: var(--font-bold);
      font-style: italic;
      margin-bottom: var(--16px);
    }

    .subtitle {
      font-size: var(--28px);
      font-weight: 300;
    }

    .hidden {
      opacity: 0;
    }
  }
</style>
