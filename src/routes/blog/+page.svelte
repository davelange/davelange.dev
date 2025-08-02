<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<p>blog index</p>

{#each data.posts as post (post)}
  <a href={`/blog/${post}`}>{post}</a><br />
{/each}
