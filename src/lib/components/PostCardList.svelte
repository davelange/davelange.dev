<script lang="ts">
  import type { blogPosts } from "$content";
  import type { CollectionEntry } from "$content/collection";
  import PostCard from "./PostCard.svelte";

  let { posts }: { posts: Array<CollectionEntry<typeof blogPosts>> } =
    $props();
</script>

<section class="list">
  {#each posts as post (post.slug)}
    <PostCard {...post} showTags />
  {/each}
</section>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: var(--36px);
  }
</style>
