import { blogPosts } from "$content";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const { slug } = params;

  const contents = await blogPosts.getEntry(slug);

  return {
    slug,
    meta: contents.meta,
    contents
  };
};
