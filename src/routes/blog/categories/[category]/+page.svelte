<script lang="ts">
  import type { PageData } from "./$types";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import CategoryNav from "$lib/components/CategoryNav.svelte";
  import { page } from "$app/state";
  import PostCardList from "$lib/components/PostCardList.svelte";
  import ListingHeader from "$lib/components/ListingHeader.svelte";

  let { data }: { data: PageData } = $props();
</script>

{#snippet header()}
  <ListingHeader title="Some thoughts and guides on things" />
{/snippet}

{#snippet nav()}
  <CategoryNav
    categories={data.tags}
    activeCategory={page.params.category}
  />
{/snippet}

{#snippet postList()}
  <PostCardList posts={data.posts} />
{/snippet}

<ListingLayout
  headerSlot={header}
  navSlot={nav}
  mainSlot={postList}
/>
