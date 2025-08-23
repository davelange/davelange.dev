<script lang="ts">
  import MenuIcon from "~icons/feather/menu";
  import XIcon from "~icons/feather/x";
  import MoonIcon from "~icons/feather/moon";
  import SunIcon from "~icons/feather/sun";
  import Icon from "./Icon.svelte";
  import { fade, slide } from "svelte/transition";
  import { themeManager } from "$lib/theme.svelte";
  import type { Snippet } from "svelte";
  let {
    isLarge = false,
    titleSlot
  }: {
    isLarge?: boolean;
    titleSlot?: Snippet;
  } = $props();

  let isMobileNavOpen = $state(false);
  let duration = 240;
</script>

{#snippet themeToggle(size: number)}
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
{/snippet}

<header class:discreet={!isLarge}>
  <div class="header-content">
    <h1 class="name">
      <a href="/">Dave Lange</a>
    </h1>
    <div class="header-actions">
      {@render themeToggle(16)}
      <button
        class="menu-btn"
        onpointerdown={() => (isMobileNavOpen = !isMobileNavOpen)}
      >
        {#if isMobileNavOpen}
          <Icon
            size="var(--20px)"
            icon={XIcon}
            color="var(--fg-neutral-mild)"
          />
        {:else}
          <Icon
            size="var(--20px)"
            icon={MenuIcon}
            color="var(--fg-neutral-mild)"
          />
        {/if}
      </button>
    </div>
  </div>

  <div class="title-slot">
    {@render titleSlot?.()}
  </div>

  <nav class="desktop-nav">
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>

  {#if isMobileNavOpen}
    <nav class="mobile-nav" transition:fade={{ duration: 80 }}>
      <a href="/about">About</a>
      <a href="/blog">Blog</a>
      <a href="/contact">Contact</a>
    </nav>
  {/if}
</header>

<style>
  header {
    display: flex;
    grid-area: header;
    padding-bottom: var(--16px);
    min-width: 240px;

    height: calc(100vh - (var(--layout-y-padding) * 2));
    position: sticky;
    top: var(--layout-y-padding);
    bottom: var(--layout-y-padding);

    @media (min-width: 768px) {
      flex-direction: column;
      gap: var(--48px);
      max-height: 100vh;
    }
  }

  .header-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;

    @media (min-width: 768px) {
      width: fit-content;
      gap: var(--48px);
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--16px);
  }

  .title-slot {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }

  .name {
    position: relative;
    z-index: 2;

    font-size: var(--24px);

    &:focus-visible {
      outline-color: var(--fg-brand-strong);
    }

    a {
      text-decoration: none;
      color: inherit;
    }
  }

  .desktop-nav {
    display: none;

    @media (min-width: 768px) {
      display: flex;
      flex-direction: column;
      gap: var(--8px);
      align-items: flex-start;
      margin-top: auto;
    }

    a {
      text-decoration: none;
      /* font-size: var(--18px); */

      &:focus-visible {
        outline-color: var(--fg-brand-strong);
      }
    }
  }
  .menu-btn {
    display: block;
    border: 0;
    padding: 0;
    background: none;

    @media (min-width: 768px) {
      display: none;
    }
  }

  .mobile-nav {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    gap: var(--16px);

    width: 100%;
    padding: var(--72px) var(--20px) var(--20px);

    border-radius: 0 0 var(--8px) var(--8px);

    a {
      text-decoration: none;
      font-size: var(--20px);
    }
  }

  .theme-btn {
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;

    width: 20px;
    height: 20px;
    translate: 0 1px;

    &:focus-visible {
      outline: 2px solid var(--fg-brand-strong);
      outline-offset: 8px;
      border-radius: 50%;
    }
  }
</style>
