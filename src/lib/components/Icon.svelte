<script lang="ts">
  import type { Component } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    size,
    color = "inherit",
    icon: Icon,
    ...props
  }: {
    size: string;
    color?: string;
    icon: Component;
  } & HTMLAttributes<HTMLSpanElement> = $props();
</script>

<Icon style="width: {size}; height: {size}" {color} {...props} />
