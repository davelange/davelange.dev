<script lang="ts">
  import ArrowRightIcon from "~icons/feather/arrow-right";
  import SettingsIcon from "~icons/feather/settings";
  import Icon from "$lib/components/Icon.svelte";
  import type { Component } from "svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { scenes, type SceneId } from ".";

  let {
    initialScene,
    withRouting,
    showAbout
  }: {
    initialScene: SceneId;
    withRouting?: boolean;
    showAbout?: boolean;
  } = $props();

  let sceneIdx = $state(
    scenes.findIndex((scene) => scene.id === initialScene)
  );

  let currentScene = $derived(scenes[sceneIdx % scenes.length]);

  let RenderedComponent = $derived.by<Promise<Component>>(
    async () => {
      const module = await import(
        `./${currentScene.id}/scene.svelte`
      );
      return module.default;
    }
  );

  function nextScene() {
    sceneIdx++;

    if (withRouting) {
      const nextName = scenes[sceneIdx % scenes.length].id;

      goto(resolve(`/shadings/${nextName}`));
    }
  }
</script>

<div class="wrapper">
  {#await RenderedComponent then Scene}
    <Scene />
  {/await}

  <div class="btn next-scene">
    <div class="scene-name">
      {#if showAbout}
        <a href={resolve(`/shadings/${currentScene.id}`)}>
          {currentScene.name} (about this)
        </a>
      {:else}
        {currentScene.name}
      {/if}
    </div>

    /

    <button type="button" onclick={nextScene}>
      <span> View next scene </span>
      <Icon icon={ArrowRightIcon} size="var(--20px)" />
    </button>
  </div>

  <button class="btn edit" data-js="edit-button">
    <Icon icon={SettingsIcon} size="var(--20px)" />
  </button>
</div>

<style>
  @keyframes fadeOut {
    from {
      opacity: 0;
      box-shadow: 0px 9px 16px -10px #00000000;
    }
    to {
      opacity: 1;
      box-shadow: 0px 9px 16px -10px #00000077;
    }
  }

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

    animation: fadeOut 0.7s ease-in forwards;

    &:hover,
    &:focus-visible,
    &:focus-within {
      .btn {
        opacity: 1;
        z-index: 10;
      }
    }
  }

  button,
  a {
    color: var(--fg-neutral-default);
    text-decoration: none;

    &:hover,
    &:focus {
      color: var(--fg-brand-strong);
      outline: none;
    }
  }

  .btn {
    opacity: 0;
    position: absolute;
    z-index: 1;
    background: var(--bg-neutral-default);
    color: var(--fg-neutral-default);
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-family: var(--font-mono);
    font-size: var(--14px);
    transition: opacity 0.2s ease-in-out;

    --offset: 0.5rem;

    @media (min-width: 768px) {
      --offset: 1.5rem;
    }

    bottom: var(--offset);
  }

  .btn.edit {
    right: var(--offset);
  }

  .btn.next-scene {
    display: flex;
    gap: var(--8px);
    left: var(--offset);

    button {
      display: flex;
      gap: var(--8px);
    }
  }

  .scene-name {
    font-weight: var(--font-bold);
  }
</style>
