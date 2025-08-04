<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<p>post: {data.meta.title}</p>
<data.contents.content />
