<script lang="ts">
  import type { PageData } from "./$types";
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import Toc from "$lib/components/Toc.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Header from "$lib/components/Header.svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.meta.title} | Dave Lange</title>
</svelte:head>

<MainLayout>
  {#snippet sidebarSlot()}
    <Header>
      {#snippet contentSlot()}
        <div class="mobile-hide">
          <Toc headings={data.meta.headings} slug={data.slug} />
        </div>
      {/snippet}
    </Header>
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
