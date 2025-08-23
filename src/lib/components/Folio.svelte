<script lang="ts">
  import { createProseObserver } from "$lib/prose-observer.svelte";
  import { onMount, onDestroy } from "svelte";
  let { title, slug }: { title: string; slug: string } = $props();

  let show = $state(false);

  const proseObserver = createProseObserver({
    key: slug,
    onMount,
    onDestroy
  });

  proseObserver?.on("scrolledDownFromSection", (sectionId) => {
    if (sectionId === "header") {
      show = true;
    }
  });

  proseObserver?.on("enteredSection", (sectionId) => {
    if (sectionId === "header") {
      show = false;
    }
  });
</script>

<div class={["folio", { show }]}>
  <a href="/blog">Blog /</a>
  <span>
    {title}
  </span>
</div>

<style>
  .folio {
    font-size: var(--14px);
    opacity: 0;
    transition: opacity 0.2s ease;
    color: var(--bg-neutral-mild);
    max-width: 240px;

    a {
      display: block;
    }

    &.show {
      opacity: 0.7;
    }
  }
</style>
