import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const posts = [];

  return {
    posts
  };
};
