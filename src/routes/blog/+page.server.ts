import type { PageServerLoad } from "./$types";
import { blogPosts } from "../../content";

export const load: PageServerLoad = async () => {
  const posts = blogPosts.getEntries({
    sort: {
      by: "position",
      order: "asc"
    }
  });
  const tags = blogPosts.getDimensionValues("tags");

  return {
    pageMeta: {
      isArticle: false
    },
    posts,
    tags
  };
};
