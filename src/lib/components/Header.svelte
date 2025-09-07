<script lang="ts">
  import MenuIcon from "~icons/feather/menu";
  import XIcon from "~icons/feather/x";
  import Icon from "./Icon.svelte";
  import { fade } from "svelte/transition";
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import ThemeToggle from "./ThemeToggle.svelte";
  import HeaderNav from "./HeaderNav.svelte";

  let {
    contentSlot,
    isDiscreet = false
  }: {
    contentSlot?: Snippet;
    isDiscreet?: boolean;
  } = $props();

  let isMobileNavOpen = $state(false);
  let mobileNav: HTMLDialogElement;
  let pages = [
    {
      label: "Blog",
      href: "/blog"
    },

    {
      label: "About",
      href: "/about"
    }
  ];
</script>

<div class="wrapper" class:is-discreet={isDiscreet}>
  <header class="header-content">
    <h1 class="name">
      <a href="/">Dave Lange</a>
    </h1>
    <div class="header-actions">
      <ThemeToggle size={16} />
      <button
        class="menu-btn"
        onclick={() => {
          if (isMobileNavOpen) {
            mobileNav.close();
          } else {
            mobileNav.showModal();
          }

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

  {@render contentSlot?.()}

  {#if !isDiscreet}
    <HeaderNav />
  {/if}

  <dialog class="mobile-nav" closedby="any" bind:this={mobileNav}>
    <nav transition:fade={{ duration: 80 }}>
      {#each pages as link (link.href)}
        <a
          href={link.href}
          class:active={link.href === page.url.pathname}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </dialog>
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

  .mobile-nav {
    max-width: 100vw;
    width: 100vw;
    margin-top: 65px;

    color: var(--fg-neutral-default);
    background: var(--bg-neutral-default);
    border: 0;
    border-radius: 0 0 var(--8px) var(--8px);

    nav {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--16px);
      padding: var(--20px);
    }

    a {
      text-decoration: none;
      font-size: var(--20px);

      &.active {
        color: var(--fg-brand-strong);
      }
    }
    /* position: fixed;
    top: 0;
    left: 0;
    right: 0; */
    /* width: 100vw;

    border: 0;

    nav {
      position: relative;
      z-index: 5;

      display: flex;
      flex-direction: column;
      gap: var(--16px);

      width: 100vw;
      height: fit-content;
      padding: var(--72px) var(--20px) var(--20px);
    }

    a {
      text-decoration: none;
      font-size: var(--20px);

      &.active {
        color: var(--fg-brand-strong);
      }
    } */
  }

  .mobile-nav-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
</style>
