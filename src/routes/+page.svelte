<script lang="ts">
  import type { PageData } from "./$types";
  import Header from "$lib/components/Header.svelte";
  import HomeScene from "$lib/components/HomeScene.svelte";
  import PostCardList from "$lib/components/PostCardList.svelte";
  import HeaderNav from "$lib/components/HeaderNav.svelte";

  let { data }: { data: PageData } = $props();
</script>

<div class="landing-wrapper">
  <Header isDiscreet />
  <div class="content">
    <p class="greeting">
      I'm a software developer. I help turn ideas into meaningful
      tools and experiences.
    </p>
    <PostCardList posts={data.posts} showTags={false} />
    <HeaderNav />
  </div>

  <div class="scene-wrapper">
    <HomeScene />
  </div>
</div>

<style>
  .landing-wrapper {
    max-width: var(--layout-max-width);
    height: fit-content;
    margin: 0 auto;
    display: grid;
    grid-template-areas:
      "header"
      "scene"
      "content";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-column-gap: 0;

    @media (min-width: 769px) {
      grid-template-areas:
        "header scene"
        "content scene";
      grid-template-rows: auto 1fr;
      grid-template-columns: auto 50%;
      grid-column-gap: var(--48px);
    }
  }

  .content {
    grid-area: content;
    display: flex;
    flex-direction: column;

    .greeting {
      font-size: var(--24px);
      margin: var(--36px) 0 var(--24px);
      max-width: 400px;
      text-wrap: pretty;
      color: var(--fg-brand-strong);

      @media (min-width: 768px) {
        margin: var(--48px) 0 var(--36px);
      }
    }
  }

  .scene-wrapper {
    grid-area: scene;
    position: initial;

    @media (min-width: 769px) {
      display: flex;
      position: sticky;
      top: 0;
      bottom: 0;
      max-height: 100vh;
      max-height: calc(100vh - (var(--20px) * 2));
    }

    @media (min-height: 1200px) {
      margin-top: 4vh;
    }
  }
</style>
