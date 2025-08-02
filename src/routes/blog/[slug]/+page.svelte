<script lang="ts">
  import type { PageData } from "./$types";
  import Markdown from "svelte-exmarkdown";

  let { data }: { data: PageData } = $props();
</script>

<p>post: {data.slug}</p>
{#if data.contents}
  <Markdown md={data.contents} />
{/if}
