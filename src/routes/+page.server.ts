import type { PageServerLoad } from "./$types";
import { blogPosts } from "../content";

export const load: PageServerLoad = async () => {
  const posts = blogPosts.getEntries({
    limit: 3
  });

  return {
    pageMeta: {
      isArticle: false
    },
    posts
  };
};
