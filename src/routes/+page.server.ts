import type { PageServerLoad } from "./$types";
import { blogPosts } from "../content";

export const load: PageServerLoad = async () => {
  const posts = blogPosts.getEntries({
    limit: 2
  });

  return {
    pageMeta: {
      isArticle: false
    },
    posts
  };
};
