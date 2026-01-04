import { blogPosts } from "$content";
import { getSceneById } from "$lib/scenes/index.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const { slug } = params;
  const scene = getSceneById(slug);
  const content = await blogPosts.getEntry(`${slug}-scene`);

  return {
    slug,
    scene,
    content
  };
};
