import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

export const getHeadings = () => {
  // @ts-ignore
  return async function transformer(tree, vFile) {
    vFile.data.headings = [];

    visit(tree, "heading", (node) => {
      const title = toString(node);
      const slug = title.toLowerCase().replace(/ /g, "-");
      vFile.data.headings.push({
        level: node.depth,
        title: toString(node),
        slug
      });
    });

    if (!vFile.data.fm) vFile.data.fm = {};
    vFile.data.fm.headings = vFile.data.headings;
  };
};
