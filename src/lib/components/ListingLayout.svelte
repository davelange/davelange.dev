<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    headerSlot,
    navSlot,
    mainSlot
  }: {
    headerSlot?: Snippet;
    navSlot?: Snippet;
    mainSlot?: Snippet;
  } = $props();
</script>

<div class="wrapper" class:no-header={!headerSlot}>
  <header class="header">
    {@render headerSlot?.()}
  </header>
  <div class="nav">
    {@render navSlot?.()}
  </div>
  <section class="main">
    {@render mainSlot?.()}
  </section>
</div>

<style>
  .wrapper {
    display: grid;

    padding: var(--20px);
    margin: 0 auto;

    grid-template-areas:
      "header"
      "nav"
      "main";
    grid-row-gap: var(--32px);

    &.no-header {
      grid-row-gap: 0;
    }

    @media (min-width: 769px) {
      grid-template-areas:
        "header header"
        "nav main";
      grid-row-gap: var(--36px);
      grid-template-columns: 37ch 70ch auto;
      grid-template-rows: auto 1fr;

      grid-column-gap: 0;
      grid-row-gap: var(--48px);

      padding: 0 var(--48px);
      margin: 0 auto;
    }
  }

  .header {
    @media (min-width: 769px) {
      grid-area: header;
      grid-column: 2 / 2;
    }
  }

  .nav {
    @media (min-width: 769px) {
      grid-area: nav;
      max-width: 200px;
      position: sticky;
      top: 100px;
      height: fit-content;
    }
  }

  .main {
    grid-area: main;
    overflow-x: scroll;

    @media (min-width: 769px) {
      overflow-x: visible;
    }
  }
</style>
