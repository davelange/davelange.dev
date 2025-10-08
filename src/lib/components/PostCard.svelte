<script lang="ts">
  import { resolve } from "$app/paths";
  import type { blogPosts } from "$content";
  import type { CollectionEntry } from "$content/collection";
  import Icon from "./Icon.svelte";
  import ChevronRight from "~icons/feather/chevron-right";

  let {
    slug,
    title,
    description,
    tags,
    showTags
  }: CollectionEntry<typeof blogPosts> & {
    showTags?: boolean;
  } = $props();
</script>

<a
  href={resolve("/blog/[slug]", {
    slug
  })}
  class="note-card"
>
  <div class="title-link">
    <div class="icon">
      <Icon
        size="var(--16px)"
        color="var(--fg-brand-strong)"
        icon={ChevronRight}
      />
    </div>

    <h2 class="title">{title}</h2>
  </div>
  <p class="description">{description}</p>
  {#if showTags}
    <div class="tags">
      {#each tags as tag (tag)}
        <span class="pill">{tag}</span>
      {/each}
    </div>
  {/if}
</a>

<style>
  .note-card {
    display: flex;
    flex-direction: column;
    gap: var(--10px);
    max-width: 520px;
    text-decoration: none;
  }

  .icon {
    translate: 0 3px;
    transition: translate 0.2s linear;
  }

  .note-card:hover,
  .note-card:focus-visible {
    outline: none;

    & .icon {
      translate: 2px 3px;
    }

    .title {
      color: var(--fg-brand-strong);
    }
  }

  .title-link {
    display: flex;
    gap: var(--4px);
    text-decoration: none;
    translate: -4px;
  }

  .title {
    font-size: var(--16px);
    font-weight: var(--font-bold);
  }

  .description {
    margin: 0;
    text-wrap: pretty;
  }

  .tags {
    display: flex;
    gap: var(--8px);
  }

  .pill {
    color: var(--fg-neutral-mild);
    background-color: var(--bg-neutral-soft);
    font-size: var(--12px);
    line-height: 1;
    padding: var(--4px) var(--8px);
    border-radius: var(--20px);
    text-transform: capitalize;
  }

  :global(html.dark) .pill {
    color: var(--fg-secondary-default);
  }
</style>
