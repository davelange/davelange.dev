<script lang="ts">
  import type { PageData } from "./$types";
  import Markdown from "svelte-exmarkdown";

  let { data }: { data: PageData } = $props();
  console.log(data.contents);
</script>

<p>post: {data.meta.title}</p>
<!-- {#if data.contents}
{/if} -->
<!-- <Markdown md={data.contents.content} /> -->
<data.contents.content />
