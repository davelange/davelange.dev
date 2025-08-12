import { blogPosts } from "$content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const posts = blogPosts.getEntries({
    filter: {
      tags: [params.category]
    }
  });

  return {
    pageMeta: {
      isArticle: false
    },
    posts,
    category: params.category,
    tags: blogPosts.getDimensionValues("tags")
  };
};
