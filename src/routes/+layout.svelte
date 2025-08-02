<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header>
  <h1>davelange.dev</h1>

  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/blog">Blog</a>
</header>

{@render children?.()}
