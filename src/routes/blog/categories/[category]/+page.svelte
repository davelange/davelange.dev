<script lang="ts">
  let { data } = $props();
</script>

<h1>{data.category}</h1>

<ul>
  {#each data.posts as post (post.slug)}
    <li>{post.title}</li>
  {/each}
</ul>
