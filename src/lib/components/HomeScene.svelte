<script lang="ts">
  import SettingsIcon from "~icons/feather/settings";
  import Icon from "./Icon.svelte";
  import { text } from "$lib/scene/config";
  import { onMount } from "svelte";
  import { createScene } from "$lib/scene/main.svelte";

  createScene({
    onMount
  });
</script>

<div class="wrapper">
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
  <button class="edit-button" data-js="edit-button">
    <Icon
      icon={SettingsIcon}
      size="var(--20px)"
      color="var(--fg-neutral-mild)"
    />
  </button>
</div>

<style>
  .wrapper {
    position: relative;
    display: flex;

    width: 100%;
    height: 100%;

    max-width: 800px;
    max-height: 800px;

    border-radius: 0.72rem;
    overflow: hidden;
    aspect-ratio: 1;

    box-shadow: -4px 10px 16px #d57d7d22;

    background: #3652c4;

    .edit-button {
      opacity: 0;
      position: absolute;
      z-index: 1;
      bottom: 1.5rem;
      right: 1.5rem;
      background: var(--bg-neutral-default);
      color: var(--fg-neutral-default);
      border: none;
      padding: 0.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: var(--14px);
      transition: opacity 0.2s ease-in-out;
    }

    &:hover {
      .edit-button {
        opacity: 1;
      }
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

  .scene-content {
    position: relative;
    margin: auto;
    width: fit-content;
    max-width: 460px;
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
