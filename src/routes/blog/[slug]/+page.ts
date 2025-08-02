import { blogPosts } from "../../../content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const contents = await blogPosts.getItem(slug);

  return {
    slug,
    meta: contents.meta,
    contents
  };
};
