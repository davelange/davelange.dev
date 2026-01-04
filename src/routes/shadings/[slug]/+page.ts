import { getSceneById } from "$lib/scenes/index.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const { slug } = params;
  const scene = getSceneById(slug);

  return {
    slug,
    scene
  };
};
