<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<h1>Some thoughts and guides on things</h1>

<nav>
  Tags
  {#each data.tags as tag (tag)}
    <a href={`/blog/categories/${tag}`}>{tag}</a><br />
  {/each}
</nav>

<hr />

{#each data.posts as post (post)}
  <a href={`/blog/${post.slug}`}>{post.title}</a><br />
{/each}
