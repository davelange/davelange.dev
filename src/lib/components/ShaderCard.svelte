<script lang="ts">
  import { resolve } from "$app/paths";
  import type { Pathname } from "$app/types";

  let {
    title,
    href,
    img
  }: { title: string; href: Pathname; img: string } = $props();
</script>

<a href={resolve(href)}>
  <img class="img" alt={title} src={img} />
  <h1>{title}</h1>
</a>

<style>
  a {
    text-decoration: none;

    &:hover,
    &:focus {
      color: var(--fg-brand-strong);
      outline: none;
    }
  }

  .img {
    border-radius: var(--4px);
    margin-bottom: var(--8px);
  }

  h1 {
    font-size: var(--18px);
  }
</style>
