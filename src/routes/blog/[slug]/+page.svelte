<script lang="ts">
  import type { PageData } from "./$types";
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import Toc from "$lib/components/Toc.svelte";

  let { data }: { data: PageData } = $props();
</script>

{#snippet header()}
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
