<script lang="ts">
  import { slide } from "svelte/transition";
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import type { Snippet } from "svelte";
  import GHIcon from "~icons/feather/github";
  import TWIcon from "~icons/feather/twitter";
  import EMIcon from "~icons/feather/mail";
  import Icon from "./Icon.svelte";

  let mobileNav: HTMLDialogElement;
  let {
    isMobileNavOpen = $bindable(),
    headerSlot
  }: {
    isMobileNavOpen: boolean;
    headerSlot: Snippet;
  } = $props();

  let pages = [
    {
      label: "Blog",
      href: "/blog"
    },
    {
      label: "About",
      href: "/about"
    },
    {
      label: "Fun with shaders",
      href: "/shadings"
    }
  ] as const;

  let links = [
    {
      label: "GitHub",
      href: "https://github.com/davelange",
      icon: GHIcon
    },
    {
      label: "Twitter",
      href: "https://twitter.com/davelange_",
      icon: TWIcon
    },
    {
      label: "Email",
      href: "mailto:hello@davelange.dev",
      icon: EMIcon
    }
  ] as const;

  $effect(() => {
    if (isMobileNavOpen) {
      mobileNav.showModal();
    } else {
      mobileNav.close();
    }
  });
</script>

<dialog
  id="mobile-nav"
  closedby="any"
  in:slide={{ duration: 80 }}
  bind:this={mobileNav}
  onclick={({ target }) => {
    if ((target as HTMLElement)?.id === "mobile-nav") {
      isMobileNavOpen = false;
      mobileNav.close();
    }
  }}
>
  <div class="content">
    {@render headerSlot?.()}
    <nav>
      {#each pages as link (link.href)}
        <a
          href={resolve(link.href)}
          class:active={link.href === page.url.pathname}
        >
          {link.label}
        </a>
      {/each}
    </nav>
    <p class="contact-message">Feel free to reach out to me!</p>

    <div class="social-links">
      {#each links as link (link.href)}
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          <Icon size="var(--16px)" icon={link.icon} />
          {link.label}
        </a>
      {/each}
    </div>
  </div>
</dialog>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  dialog {
    max-width: unset;
    max-height: unset;
    width: 100vw;
    height: 100vh;
    padding: 0;
    background: transparent;
    border: 0;
    opacity: 0;

    &::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
      animation: fade-in 130ms forwards ease;
    }

    &[open] {
      animation: fade-in 130ms forwards ease;
    }

    .content {
      color: var(--fg-neutral-default);
      background: var(--bg-neutral-default);
      padding: 0 var(--20px) var(--36px);
      border-radius: 0 0 var(--8px) var(--8px);
    }

    nav {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--16px);
      margin: var(--36px) 0;
    }

    a {
      text-decoration: none;
      font-size: var(--20px);

      &.active {
        color: var(--fg-brand-strong);
      }
    }

    .contact-message {
      color: var(--fg-brand-strong);
    }

    .social-links {
      display: flex;
      gap: var(--16px);

      a {
        font-size: var(--16px);
        color: var(--fg-neutral-default);
        text-decoration: none;
        display: flex;
        gap: var(--8px);
        align-items: center;
      }
    }
  }
</style>
