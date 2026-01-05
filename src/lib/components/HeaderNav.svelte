<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import Contacts from "./Contacts.svelte";

  let pages = [
    {
      label: "Blog",
      href: "/blog"
    },
    {
      label: "About",
      href: "/about"
    }
  ] as const;
</script>

<nav class="desktop-nav">
  {#each pages as link (link.href)}
    <a
      href={resolve(link.href)}
      class:active={page.url.pathname.includes(link.href)}
    >
      {link.label}
    </a>
  {/each}
  <Contacts />
</nav>

<style>
  .desktop-nav {
    display: none;

    @media (min-width: 768px) {
      display: flex;
      flex-direction: column;
      gap: var(--8px);
      align-items: flex-start;
    }

    a {
      text-decoration: none;

      &:focus-visible {
        outline-color: var(--fg-brand-strong);
      }

      &.active,
      &:hover,
      &:focus-visible {
        color: var(--fg-brand-strong);
      }
    }
  }
</style>
