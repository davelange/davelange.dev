<script lang="ts">
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import ListingHeader from "$lib/components/ListingHeader.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import SidebarHeader from "$lib/components/SidebarHeader.svelte";
  import ShaderCard from "$lib/components/ShaderCard.svelte";
  import glowImg from "./glow/glow.png";
  import lakesImg from "./lakes/lakes.png";
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
      <div class="grid">
        <ShaderCard
          title="Lakes"
          href="/shadings/lakes"
          img={lakesImg}
        />
        <ShaderCard
          title="Glow"
          href="/shadings/glow"
          img={glowImg}
        />
      </div>
    {/snippet}
  </ListingLayout>
</MainLayout>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--24px);
  }
</style>
