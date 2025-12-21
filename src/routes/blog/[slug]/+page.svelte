<script lang="ts">
  import type { PageData } from "./$types";
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import Toc from "$lib/components/Toc.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import SidebarHeader from "$lib/components/SidebarHeader.svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.meta.title} | Dave Lange</title>
  <meta name="description" content={data.meta.description} />
</svelte:head>

<MainLayout>
  {#snippet sidebarSlot()}
    <Sidebar>
      {#snippet topSlot()}
        <SidebarHeader />
      {/snippet}
      {#snippet bottomSlot()}
        <div class="mobile-hide">
          <Toc headings={data.meta.headings} slug={data.slug} />
        </div>
      {/snippet}
    </Sidebar>
  {/snippet}

  <ListingLayout>
    {#snippet headerSlot()}
      <ArticleHeader {...data.meta} />
    {/snippet}

    {#snippet mainSlot()}
      <article class="prose">
        {#if data.contents.content}
          <data.contents.content />
        {/if}
      </article>
    {/snippet}
  </ListingLayout>
</MainLayout>
