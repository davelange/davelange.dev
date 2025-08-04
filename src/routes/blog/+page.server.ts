import type { PageServerLoad } from "./$types";
import { blogPosts } from "../../content";

export const load: PageServerLoad = async () => {
  const posts = blogPosts.getEntries();

  return {
    posts
  };
};
