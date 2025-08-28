<script lang="ts">
  import type { PageData } from "./$types";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import CategoryNav from "$lib/components/CategoryNav.svelte";
  import { page } from "$app/state";
  import PostCardList from "$lib/components/PostCardList.svelte";
  import ListingHeader from "$lib/components/ListingHeader.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Header from "$lib/components/Header.svelte";

  let { data }: { data: PageData } = $props();
</script>

<MainLayout>
  {#snippet sidebarSlot()}
    <Header>
      {#snippet contentSlot()}
        <div class="mobile-hide">
          <CategoryNav
            categories={data.tags}
            activeCategory={page.params.category}
          />
        </div>
      {/snippet}
    </Header>
  {/snippet}

  <ListingLayout>
    {#snippet headerSlot()}
      <ListingHeader
        title="Some thoughts and guides on things - {page.params
          .category}"
      />
    {/snippet}

    {#snippet mainSlot()}
      <PostCardList posts={data.posts} />
    {/snippet}
  </ListingLayout>
</MainLayout>
