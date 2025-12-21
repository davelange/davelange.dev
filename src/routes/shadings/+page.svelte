<script lang="ts">
  import { resolve } from "$app/paths";
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import ListingHeader from "$lib/components/ListingHeader.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import SidebarHeader from "$lib/components/SidebarHeader.svelte";
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
    <Sidebar>
      {#snippet topSlot()}
        <SidebarHeader />
      {/snippet}
    </Sidebar>
  {/snippet}

  <ListingLayout>
    {#snippet headerSlot()}
      <ListingHeader title="Some fun with shaders" />
    {/snippet}

    {#snippet mainSlot()}
      <a href={resolve("/shadings/lakes")}>Lakes</a><br />
      <a href={resolve("/shadings/glow")}>Glow</a>
    {/snippet}
  </ListingLayout>
</MainLayout>
