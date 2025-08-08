<script lang="ts" generics="T extends keyof HTMLElementTagNameMap">
  import type { SvelteHTMLElements } from "svelte/elements";

  type ElementProps = SvelteHTMLElements[T];

  type Props = {
    as?: T;
    active?: boolean;
  } & ElementProps;

  const {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as = "a" as any,
    children,
    active,
    ...props
  }: Props = $props();

  // What we do to please the type checker
  const Element = as as "a";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rest = { ...(props as any) };
</script>

<svelte:element
  this={Element}
  class="pill {active ? 'active' : ''}"
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  .pill {
    cursor: pointer;
    font-size: var(--14px);
    line-height: 1;

    text-transform: capitalize;
    text-decoration: none;

    color: var(--fg-neutral-mild);
    background-color: var(--bg-neutral-soft);

    width: fit-content;
    padding: var(--4px) var(--8px);
    border-radius: var(--20px);

    transition:
      color 0.3s ease,
      background-color 0.3s ease;

    &:hover,
    &:focus-visible,
    &.active {
      background-color: var(--fg-brand-strong);
      color: var(--bg-neutral-default);
    }

    @media (min-width: 769px) {
      padding: var(--8px) var(--12px);
    }
  }

  :global(html.dark) a {
    background-color: var(--bg-neutral-soft);
    color: var(--fg-secondary-default);

    &:hover,
    &:focus-visible,
    &.active {
      background-color: var(--fg-secondary-default);
      color: var(--bg-neutral-default);
    }
  }
</style>
