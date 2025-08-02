import { getBlogFiles } from "../../content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const posts = getBlogFiles();

  return {
    posts
  };
};
