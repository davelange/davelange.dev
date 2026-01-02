<script lang="ts">
  import { text } from "$lib/scenes/lake/config";
  import { onMount } from "svelte";
  import { createScene } from "$lib/scenes/lake/main.svelte";

  createScene({
    onMount
  });
</script>

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

<style>
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
