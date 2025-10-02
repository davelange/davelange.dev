<script lang="ts">
  import { page } from "$app/state";
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
  ];
</script>

<nav class="desktop-nav">
  {#each pages as link (link.href)}
    <a
      href={link.href}
      class:active={link.href === page.url.pathname}
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
      margin-top: auto;
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
