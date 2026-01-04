<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.content.meta.title} | Dave Lange</title>
  <meta name="description" content={data.content.meta.description} />
</svelte:head>

<div class="prose">
  <data.content.content />
</div>
