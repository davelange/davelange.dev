<script lang="ts">
  import ListingLayout from "$lib/components/ListingLayout.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";
  import Header from "$lib/components/Header.svelte";
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>Blog | Dave Lange</title>
  <meta name="description" content="404 :/" />
</svelte:head>

<MainLayout>
  {#snippet sidebarSlot()}
    <Header />
  {/snippet}

  <ListingLayout>
    {#snippet mainSlot()}
      <div class="wrapper">
        {#if page.error?.message === "Not Found"}
          <span class="message">Not found</span>
          <span class="code">404</span>
        {:else}
          <span class="message">Something went wrong</span>
        {/if}
      </div>
    {/snippet}
  </ListingLayout>
</MainLayout>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--4px);
    margin: 12vh auto;

    .message {
      font-size: var(--20px);
      font-family: var(--font-sans);
    }

    .code {
      font-family: var(--font-mono);
    }
  }
</style>
