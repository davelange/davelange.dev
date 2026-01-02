<script lang="ts">
  import { slide } from "svelte/transition";
  import Icon from "./Icon.svelte";
  import MoonIcon from "~icons/feather/moon";
  import SunIcon from "~icons/feather/sun";
  import { themeManager } from "$lib/theme.svelte";

  let { size = 16 }: { size?: number } = $props();
  let duration = 240;
</script>

<button
  type="button"
  data-js="theme-toggle"
  class="theme-btn"
  data-theme="dark"
  aria-label="Toggle theme"
  title="Toggle theme"
  onclick={() => themeManager.toggle()}
>
  {#if themeManager.theme === "dark"}
    <div
      in:slide={{
        duration,
        axis: "y",
        delay: duration
      }}
      out:slide={{
        duration,
        axis: "y"
      }}
    >
      <Icon
        size="var(--{size}px)"
        icon={MoonIcon}
        color="var(--fg-neutral-mild)"
      />
    </div>
  {:else if themeManager.theme === "light"}
    <div
      in:slide={{
        duration,
        axis: "y",
        delay: duration
      }}
      out:slide={{
        duration,
        axis: "y"
      }}
    >
      <Icon
        size="var(--{size}px)"
        icon={SunIcon}
        color="var(--fg-neutral-mild)"
      />
    </div>
  {/if}
</button>

<style>
  .theme-btn {
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;

    width: 16px;
    height: 16px;
    translate: 0 1px;

    &:focus-visible {
      outline: 2px solid var(--fg-brand-strong);
      outline-offset: 8px;
      border-radius: 50%;
    }
  }
</style>
