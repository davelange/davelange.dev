<script lang="ts">
  import { resolve } from "$app/paths";
  import Icon from "./Icon.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
  import XIcon from "~icons/feather/x";
  import MenuIcon from "~icons/feather/menu";
  import HeaderNav from "./HeaderNav.svelte";
  import MobileNav from "./MobileNav.svelte";

  let {
    hideNav
  }: {
    hideNav?: boolean;
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

{@render header?.()}
{#if !hideNav}
  <HeaderNav />
{/if}
<MobileNav bind:isMobileNavOpen headerSlot={header} />

<style>
  .header-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    padding: var(--16px) 0;

    @media (min-width: 768px) {
      padding: 0;
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
