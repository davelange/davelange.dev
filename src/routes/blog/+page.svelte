<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<p>blog index</p>

{#each data.posts as post (post.id)}
  <a href={`/blog/${post.id}`}>{post.title}</a><br />
{/each}
