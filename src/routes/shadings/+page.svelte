<script lang="ts">
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import ListingHeader from "$lib/components/ListingHeader.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Header from "$lib/components/Header.svelte";
</script>

<svelte:head>
  <title>Things with shaders | Dave Lange</title>
  <meta
    name="description"
    content="Experiments with shaders and all that"
  />
</svelte:head>

<MainLayout>
  {#snippet sidebarSlot()}
    <Header />
  {/snippet}

  <ListingLayout>
    {#snippet headerSlot()}
      <ListingHeader title="Some fun with shaders" />
    {/snippet}

    {#snippet mainSlot()}
      <a href="shadings/lakes">Lakes</a>
    {/snippet}
  </ListingLayout>
</MainLayout>
