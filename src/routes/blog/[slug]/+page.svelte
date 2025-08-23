<script lang="ts">
  import type { PageData } from "./$types";
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import Toc from "$lib/components/Toc.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Header from "$lib/components/Header.svelte";
  import Folio from "$lib/components/Folio.svelte";

  let { data }: { data: PageData } = $props();
</script>

<!-- {#snippet header()}
  <ArticleHeader {...data.meta} />
{/snippet}

{#snippet nav()}
  <Toc headings={data.meta.headings} slug={data.slug} />
{/snippet}

{#snippet main()}
  <article class="prose">
    {#if data.contents.content}
      <data.contents.content />
    {/if}
  </article>
{/snippet}

<ListingLayout headerSlot={header} navSlot={nav} mainSlot={main} />
 -->

<MainLayout>
  {#snippet sidebarSlot()}
    <Header>
      {#snippet titleSlot()}
        <Folio title={data.meta.title} slug={data.slug} />
      {/snippet}
    </Header>
  {/snippet}

  <ListingLayout>
    {#snippet headerSlot()}
      <ArticleHeader {...data.meta} />
    {/snippet}

    {#snippet navSlot()}
      <Toc headings={data.meta.headings} slug={data.slug} />
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
