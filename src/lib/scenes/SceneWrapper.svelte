<script lang="ts">
  import SettingsIcon from "~icons/feather/settings";
  import Icon from "$lib/components/Icon.svelte";

  let { children } = $props();
</script>

<div class="wrapper">
  {@render children?.()}

  <button class="edit-button" data-js="edit-button">
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
        z-index: 10;
      }
    }
  }
</style>
