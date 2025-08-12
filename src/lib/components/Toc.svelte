<script lang="ts">
  import type { CollectionEntry } from "$content/collection";
  import { blogPosts } from "$content";
  import { proseObserverManager } from "$lib/prose-observer.svelte";
  import { onMount } from "svelte";

  let {
    headings,
    slug
  }: {
    headings: CollectionEntry<typeof blogPosts>["headings"];
    slug: string;
  } = $props();

  let activeSection = $state("");
  let timeout = $state<ReturnType<typeof setTimeout>>();

  const proseObserver = proseObserverManager.getObserver(slug);

  proseObserver?.on("enteredSection", (sectionId) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      activeSection =
        sectionId === "header"
          ? headings.at(0)?.slug || ""
          : sectionId;
    }, 200);
  });

  proseObserver?.on("scrolledUpFromSection", (sectionId) => {
    timeout = setTimeout(() => {
      const prev = headings.findIndex(
        (heading) => heading.slug === sectionId
      );

      if (prev > 0) activeSection = headings[prev - 1].slug;
    }, 10);
  });

  onMount(() => {
    const currentSection = window.location.hash.split("#").at(1);
    activeSection = currentSection || headings.at(0)?.slug || "";
  });

  function handleClick(
    event: MouseEvent & { currentTarget: HTMLAnchorElement }
  ) {
    event.preventDefault();
    const { currentTarget } = event;
    const slug = currentTarget?.href?.split("#").at(1);

    const section = slug ? document.getElementById(slug) : null;

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<div class="nav">
  <p class="title">Table of Contents</p>
  <ul>
    {#each headings as heading (heading.title)}
      <li
        class:active={heading.slug === activeSection}
        style:padding-left={`${(heading.level - 2) * 10}%`}
      >
        <a href={`#${heading.slug}`} onclick={handleClick}
          >{heading.title}</a
        >
      </li>
    {/each}
  </ul>
</div>

<style>
  .nav {
    grid-area: nav;
    max-width: 200px;
    position: sticky;
    top: 180px;

    .title {
      font-size: var(--14px);
      color: var(--fg-neutral-mild);
      margin: 0 0 var(--16px);
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--8px);

    list-style: none;
    margin: 0;
    padding: 0;

    li {
      &.active {
        color: var(--fg-brand-mild);
      }
    }

    a {
      text-decoration: none;
    }
  }
</style>
