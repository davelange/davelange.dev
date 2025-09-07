<script lang="ts">
  import GHIcon from "~icons/feather/github";
  import TWIcon from "~icons/feather/twitter";
  import EMIcon from "~icons/feather/mail";
  import Icon from "./Icon.svelte";

  let dialog: HTMLDialogElement;

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
  ];
</script>

<button class="contacts-btn" onclick={() => dialog.showModal()}>
  Contact
</button>

<dialog closedby="any" bind:this={dialog}>
  <div class="dialog-content">
    <p>Feel free to reach out to me!</p>

    <div class="links">
      {#each links as link (link.href)}
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          <Icon size="var(--16px)" icon={link.icon} />
          {link.label}
        </a>
      {/each}
    </div>
    <button class="close-btn" onclick={() => dialog.close()}>
      Go back
    </button>
  </div>
</dialog>

<style>
  .contacts-btn {
    text-decoration: none;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: inherit;

    &:focus-visible {
      outline-color: var(--fg-brand-strong);
    }
  }

  dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 800px;
    max-width: 95%;
    max-height: 95%;
    margin: auto;
    translate: 0 -10vh;
    background-color: var(--bg-neutral-default);
    border: 1px solid var(--fg-neutral-default);
    color: var(--fg-neutral-default);
    border-radius: var(--8px);
    padding: var(--24px) var(--36px);
    z-index: 2;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: var(--16px);

    p {
      font-size: var(--20px);
    }
  }

  .links {
    display: flex;
    gap: var(--16px);
  }

  a {
    color: var(--fg-neutral-default);
    text-decoration: none;
    transition: color 0.2s ease;
    display: flex;
    gap: var(--8px);
    align-items: center;
  }

  a:hover,
  a:focus {
    color: var(--fg-brand-strong);
  }

  .close-btn {
    margin-top: var(--16px);
    padding: var(--8px) var(--16px);
    background: none;
    border: 1px solid var(--fg-neutral-default);
    color: var(--fg-neutral-default);
    border-radius: var(--4px);
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
  }

  .close-btn:hover {
    background: var(--fg-neutral-default);
    color: var(--bg-neutral-default);
  }
</style>
