import type { PageServerLoad } from "./$types";
import { blogPosts } from "../../content";

export const load: PageServerLoad = async () => {
  const posts = blogPosts.getEntries();
  const tags = blogPosts.getDimensionValues("tags");

  return {
    posts,
    tags
  };
};
