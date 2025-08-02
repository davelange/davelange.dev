import { getFileContents } from "../../../content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const contents = getFileContents(slug);

  return {
    slug,
    contents
  };
};
