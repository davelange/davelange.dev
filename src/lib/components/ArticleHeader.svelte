<script lang="ts">
  import type { blogPosts } from "$content";
  import type { CollectionEntry } from "$content/collection";
  import Pill from "./Pill.svelte";

  let {
    title,
    publishedAt,
    tags = []
  }: CollectionEntry<typeof blogPosts> = $props();

  const formattedDate = publishedAt.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long"
  });
</script>

<header class="header" id="header" data-article-header>
  <h1 class="title">
    {title}
  </h1>

  {#if tags.length > 0}
    <div class="tags">
      {#each tags as tag (tag)}
        <Pill as="a" href={`/blog/categories/${tag}`}>
          {tag}
        </Pill>
      {/each}
    </div>
  {/if}

  <time class="date" datetime={formattedDate}>
    Published {formattedDate}
  </time>
</header>

<style>
  .header {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--16px);
  }
  .title {
    font-size: var(--32px);
    color: var(--fg-brand-strong);
    line-height: 1.2;
    letter-spacing: -0.02em;
    position: relative;

    @media (min-width: 769px) {
      font-size: var(--36px);
    }
  }
  .date {
    font-size: var(--16px);
    color: var(--fg-neutral-mild);
  }
  .tags {
    color: var(--fg-brand-mild);
    display: flex;
    gap: var(--8px);
  }
</style>
