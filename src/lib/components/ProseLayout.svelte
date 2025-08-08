<script lang="ts">
  let { children } = $props();
</script>

<div class="wrapper prose">
  {@render children?.()}
</div>

<style>
  .wrapper {
    padding: var(--20px);
    margin: 0 auto;
  }
</style>
