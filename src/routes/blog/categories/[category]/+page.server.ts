import { blogPosts } from "$content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const posts = blogPosts.getEntries({
    filter: {
      tags: [params.category]
    }
  });

  console.log(posts);

  return {
    posts,
    category: params.category
  };
};
