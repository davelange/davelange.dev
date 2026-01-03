<script lang="ts">
  import ArrowRightIcon from "~icons/feather/arrow-right";
  import SettingsIcon from "~icons/feather/settings";
  import Icon from "$lib/components/Icon.svelte";
  import type { Snippet } from "svelte";

  let {
    children,
    sceneName,
    nextScene
  }: {
    children: Snippet;
    sceneName: string;
    nextScene: () => void;
  } = $props();
</script>

<div class="wrapper">
  {@render children?.()}

  <div class="btn next-scene">
    <div>
      <strong>
        {sceneName} /
      </strong>
    </div>

    <button type="button" onclick={nextScene}>
      <span> View next scene </span>
      <Icon
        icon={ArrowRightIcon}
        size="var(--20px)"
        color="var(--fg-neutral-mild)"
      />
    </button>
  </div>

  <button class="btn edit" data-js="edit-button">
    <Icon
      icon={SettingsIcon}
      size="var(--20px)"
      color="var(--fg-neutral-mild)"
    />
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

    &:hover {
      .btn {
        opacity: 1;
        z-index: 10;
      }
    }
  }

  .btn {
    opacity: 0;
    position: absolute;
    z-index: 1;
    bottom: 1.5rem;
    background: var(--bg-neutral-default);
    color: var(--fg-neutral-default);
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-family: var(--font-mono);
    font-size: var(--14px);
    transition: opacity 0.2s ease-in-out;
  }

  .btn.edit {
    right: 1.5rem;
  }

  .btn.next-scene {
    display: flex;
    gap: var(--8px);
    left: 1.5rem;

    button {
      display: flex;
      gap: var(--8px);
    }
  }
</style>
