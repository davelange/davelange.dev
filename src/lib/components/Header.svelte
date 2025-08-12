<script lang="ts">
  import MenuIcon from "~icons/feather/menu";
  import XIcon from "~icons/feather/x";
  import MoonIcon from "~icons/feather/moon";
  import SunIcon from "~icons/feather/sun";
  import Icon from "./Icon.svelte";
  import { fade } from "svelte/transition";
  import { page } from "$app/state";
  import Folio from "./Folio.svelte";
  import { themeManager } from "$lib/theme.svelte";

  let { isLarge = false }: { isLarge?: boolean } = $props();

  let isMobileNavOpen = $state(false);
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
    <div class="icon icon--dark">
      <Icon
        size="var(--{size}px)"
        icon={MoonIcon}
        color="var(--fg-neutral-mild)"
      />
    </div>
    <div class="icon icon--light">
      <Icon
        size="var(--{size}px)"
        icon={SunIcon}
        color="var(--fg-neutral-mild)"
      />
    </div>
  </button>
{/snippet}

<header class:discreet={!isLarge}>
  <h1 class="name">
    <a href="/"> Dave Lange </a>
  </h1>

  <div class="folio">
    {#if page.data.pageMeta?.isArticle}
      <Folio
        title={page.data.meta.title}
        slug={page.params.slug || ""}
      />
    {/if}
  </div>

  <nav class="desktop-nav">
    <a href="/about">About</a>
    <a href="/blog">Blog</a>
    {@render themeToggle(16)}
  </nav>

  <div class="mobile-nav-actions">
    {@render themeToggle(24)}

    <button
      class="menu-btn"
      onpointerdown={() => (isMobileNavOpen = !isMobileNavOpen)}
    >
      {#if isMobileNavOpen}
        <Icon
          size="var(--24px)"
          icon={XIcon}
          color="var(--fg-neutral-mild)"
        />
      {:else}
        <Icon
          size="var(--24px)"
          icon={MenuIcon}
          color="var(--fg-neutral-mild)"
        />
      {/if}
    </button>
  </div>

  {#if isMobileNavOpen}
    <nav class="mobile-nav" transition:fade={{ duration: 80 }}>
      <a href="/about">About</a>
      <a href="/blog">Blog</a>
    </nav>
  {/if}
</header>

<style>
  header {
    grid-area: header;
    position: sticky;
    top: 0;
    bottom: 0;
    z-index: 3;

    background: var(--bg-neutral-default);

    padding: var(--20px);
    width: 100%;

    max-width: var(--layout-max-width);
    margin: 0 auto;

    display: grid;
    grid-template-columns: auto auto;
    align-items: baseline;

    /* transition: background-color 0.2s ease; */

    @media (min-width: 768px) {
      padding: var(--32px) var(--48px);
      grid-template-columns: 37ch 70ch auto;

      &.discreet {
        padding-top: var(--20px);
        padding-bottom: var(--20px);
      }
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

  .folio {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }

  .desktop-nav {
    display: none;
    align-items: center;
    gap: var(--20px);
    margin-left: auto;

    @media (min-width: 768px) {
      display: flex;
    }

    a {
      text-decoration: none;

      &:focus-visible {
        outline-color: var(--fg-brand-strong);
      }
    }
  }

  .mobile-nav-actions {
    position: relative;
    z-index: 2;

    margin-left: auto;
    align-self: center;
    display: flex;
    align-items: center;
    gap: var(--16px);

    @media (min-width: 768px) {
      display: none;
    }
  }

  .menu-btn {
    display: block;
    border: 0;
    padding: 0;
    background: none;
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

    background: var(--color-brand-300);
    border-radius: 0 0 var(--8px) var(--8px);

    a {
      text-decoration: none;
      font-size: var(--20px);
    }
  }

  .theme-btn {
    position: relative;
    display: flex;
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;

    width: 24px;
    height: 24px;

    @media (min-width: 768px) {
      width: 16px;
      height: 16px;
    }

    &:focus-visible {
      outline: 2px solid var(--fg-brand-strong);
      outline-offset: 8px;
      border-radius: 50%;
    }
  }

  .icon {
    display: block;
    position: absolute;
    color: var(--fg-neutral-mild);
    inset: 0;
    opacity: 1;
    transition: all 0.4s 0.3s ease;

    margin: auto;
  }

  :global(html.dark) .icon--light {
    transition-delay: 0s;
    translate: 0 16px;
    opacity: 0;
  }

  :global(html:not(.dark)) .icon--dark {
    transition-delay: 0s;
    translate: 0 -16px;
    opacity: 0;
  }
</style>
