<script lang="ts">
  import type { PageData } from "./$types";
  import Header from "$lib/components/Header.svelte";
  import HomeScene from "$lib/components/HomeScene.svelte";
  import PostCardList from "$lib/components/PostCardList.svelte";

  let { data }: { data: PageData } = $props();
</script>

<div class="landing-wrapper">
  <Header isLarge>
    {#snippet titleSlot()}
      <div class="sidebar-content">
        <p class="greeting">
          I'm a software developer. I help turn ideas into meaningful
          tools and experiences.
        </p>

        <PostCardList posts={data.posts} showTags={false} />

        <!-- <a href="/blog" class="view-all">Read more</a> -->
      </div>
    {/snippet}
  </Header>

  <div class="scene-wrapper">
    <HomeScene />
  </div>
</div>

<style>
  .landing-wrapper {
    max-width: var(--layout-max-width);
    min-height: calc(100vh - (var(--layout-y-padding) * 2));
    margin: 0 auto;
    display: grid;
    grid-template-areas:
      "header"
      "scene"
      "info";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-column-gap: 0;

    @media (min-width: 769px) {
      grid-template-areas:
        "header scene"
        "header scene";
      grid-template-rows: auto 1fr;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: var(--48px);
    }
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;

    .greeting {
      font-size: var(--24px);
      margin-bottom: var(--48px);
      max-width: 400px;
      text-wrap: pretty;
    }
  }

  .scene-wrapper {
    grid-area: scene;
    position: initial;
    /* padding: var(--8px) var(--32px); */
    display: none;

    @media (min-width: 769px) {
      display: flex;
      position: sticky;
      top: 0;
      bottom: 0;
      max-height: 100vh;
      /* padding: var(--32px); */
      max-height: calc(100vh - (var(--20px) * 2));
    }
  }
</style>
