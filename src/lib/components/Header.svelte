<script lang="ts">
  import MenuIcon from "~icons/feather/menu";
  import XIcon from "~icons/feather/x";
  import Icon from "./Icon.svelte";
  import type { Snippet } from "svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
  import HeaderNav from "./HeaderNav.svelte";
  import MobileNav from "./MobileNav.svelte";
  import { resolve } from "$app/paths";

  let {
    contentSlot,
    isDiscreet = false
  }: {
    contentSlot?: Snippet;
    isDiscreet?: boolean;
  } = $props();

  let isMobileNavOpen = $state(false);
</script>

{#snippet header()}
  <header class="header-content">
    <h1 class="name">
      <a href={resolve("/")}>Dave Lange</a>
    </h1>
    <div class="header-actions">
      <ThemeToggle size={16} />
      <button
        type="button"
        aria-label="Toggle mobile navigation"
        title="Toggle mobile navigation"
        class="menu-btn"
        onclick={() => {
          isMobileNavOpen = !isMobileNavOpen;
        }}
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
  </header>
{/snippet}

<div class="wrapper" class:is-discreet={isDiscreet}>
  {@render header?.()}
  {@render contentSlot?.()}

  {#if !isDiscreet}
    <HeaderNav />
  {/if}

  <MobileNav bind:isMobileNavOpen headerSlot={header} />
</div>

<style>
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    grid-area: header;
    padding-top: var(--16px);
    padding-bottom: var(--16px);
    gap: var(--36px);
    z-index: 2;

    position: sticky;
    top: 0;
    bottom: var(--layout-y-padding);

    background-color: var(--bg-neutral-default);
    transition: background-color 0.2s ease;

    &.is-discreet {
      position: static;
      height: auto;
    }

    @media (min-width: 768px) {
      padding: 0;
      top: var(--layout-y-padding);
      min-width: 240px;
      height: calc(100vh - (var(--layout-y-padding) * 2));
      flex-direction: column;
      gap: var(--48px);
      max-height: min(100vh, 840px);
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

  .menu-btn {
    display: block;
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;

    @media (min-width: 768px) {
      display: none;
    }
  }
</style>
