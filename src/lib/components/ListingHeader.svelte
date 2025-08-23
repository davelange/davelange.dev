<script lang="ts">
  const { title }: { title: string } = $props();
</script>

<p class="title">{title}</p>

<style>
  .title {
    font-size: var(--24px);
    color: var(--fg-brand-strong);
    margin: 0;
  }
</style>
