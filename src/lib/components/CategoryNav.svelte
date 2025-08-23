<script lang="ts">
  import Pill from "./Pill.svelte";

  let {
    categories,
    activeCategory = ""
  }: {
    categories: string[];
    activeCategory?: string;
  } = $props();
</script>

<nav class="nav">
  <p class="title">Browse by topic</p>

  <ul class="list">
    <Pill as="a" href="/blog" active={!activeCategory}>All</Pill>
    {#each categories as tag (tag)}
      <li>
        <Pill
          as="a"
          href={`/blog/categories/${tag}`}
          active={tag === activeCategory}
        >
          {tag}
        </Pill>
      </li>
    {/each}
  </ul>
</nav>

<style>
  nav {
    max-width: 240px;
  }

  .title {
    font-size: var(--14px);
    color: var(--fg-neutral-mild);
    margin: 0 0 var(--16px);
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--8px);
    padding-left: 0;
    padding-right: var(--8px);

    li {
      list-style: none;
      display: inline-flex;
    }
  }
</style>
