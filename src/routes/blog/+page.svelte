<script lang="ts">
  import type { PageData } from "./$types";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import CategoryNav from "$lib/components/CategoryNav.svelte";
  import { page } from "$app/state";
  import PostCardList from "$lib/components/PostCardList.svelte";
  import ListingHeader from "$lib/components/ListingHeader.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import SidebarHeader from "$lib/components/SidebarHeader.svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Blog | Dave Lange</title>
  <meta
    name="description"
    content="Some thoughts and guides on things"
  />
</svelte:head>

<MainLayout>
  {#snippet sidebarSlot()}
    <Sidebar>
      {#snippet topSlot()}
        <SidebarHeader />
      {/snippet}
      {#snippet bottomSlot()}
        <div class="mobile-hide">
          <CategoryNav
            categories={data.tags}
            activeCategory={page.params.category}
          />
        </div>
      {/snippet}
    </Sidebar>
  {/snippet}

  <ListingLayout>
    {#snippet headerSlot()}
      <ListingHeader title="Some thoughts and guides on things" />
    {/snippet}

    {#snippet mainSlot()}
      <PostCardList posts={data.posts} />
    {/snippet}
  </ListingLayout>
</MainLayout>
