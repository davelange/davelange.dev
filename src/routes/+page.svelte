<script lang="ts">
  import type { PageData } from "./$types";
  import Header from "$lib/components/Header.svelte";
  import HomeScene from "$lib/components/HomeScene.svelte";
  import PostCard from "$lib/components/PostCard.svelte";

  let { data }: { data: PageData } = $props();
</script>

<div class="main">
  <div class="landing-wrapper">
    <Header isLarge />
    <div class="info-wrapper">
      <div class="info-frame main-info">
        <p class="greeting">
          I'm a software developer. I help turn ideas into meaningful
          tools and experiences.
        </p>

        <div class="note-list">
          <div class="note-header">
            <h3>Blog</h3>
          </div>
          {#each data.posts as post (post.slug)}
            <PostCard {...post} />
          {/each}
        </div>
      </div>
    </div>

    <div class="scene-wrapper">
      <HomeScene />
    </div>
  </div>
</div>

<style>
  .landing-wrapper {
    max-width: var(--layout-max-width);
    min-height: 100vh;
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
        "info scene";
      grid-template-rows: auto 1fr;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: var(--48px);
    }
  }

  .info-wrapper {
    padding: var(--8px) var(--32px);
    grid-area: info;

    @media (min-width: 769px) {
      padding-left: var(--48px);
    }
  }

  .main-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--20px);

    .greeting {
      font-size: var(--24px);
      margin: var(--20px) 0 var(--8px);
      max-width: 400px;
      text-wrap: pretty;
    }

    @media (min-width: 769px) {
      gap: var(--48px);
    }
  }
  .note-list {
    display: flex;
    flex-direction: column;
    gap: var(--24px);
  }
  .note-header {
    h3 {
      text-transform: uppercase;
      font-weight: var(--font-normal);
      font-size: var(--14px);
      color: var(--fg-brand-strong);
    }

    margin-bottom: var(--16px);
  }

  .scene-wrapper {
    grid-area: scene;
    position: initial;
    padding: var(--8px) var(--32px);
    display: flex;

    @media (min-width: 769px) {
      position: sticky;
      top: 0;
      bottom: 0;
      max-height: 100vh;
      padding: var(--32px);
    }
  }
</style>
