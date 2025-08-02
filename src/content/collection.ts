import * as z from "zod";

type CollectionOptions<T extends z.ZodObject> = {
  path: string;
  schema: T;
};

class Collection<T extends z.ZodObject, Item extends z.infer<T> & { slug: string }> {
  static basePath = "/src/content";

  path = "";
  schema: z.ZodObject;
  items: Array<Item> = [];

  constructor(options: CollectionOptions<T>) {
    this.schema = options.schema.extend({
      slug: z.string()
    });
    this.path = options.path;
    this.items = this.compileItems();
  }

  compileItems() {
    const items: Array<Item> = [];
    const paths = import.meta.glob(`/src/content/**/*.svx`, { eager: true });

    for (const path in paths) {
      if (!path.includes(`/src/content/${this.path}`)) continue;

      const file = paths[path] as { metadata: Item };
      const slug = path.split("/").at(-1)?.replace(".svx", "");
      const item = { ...file.metadata, slug } as Item;
      items.push(item);
    }

    return items;
  }

  getItems() {
    return this.items;
  }

  async getItem(slug: string) {
    if (!this.items.find((item) => item.slug === slug)) {
      throw Error(`Could not find ${slug}`);
    }

    try {
      const post = await import(
        /* @vite-ignore */ `${Collection.basePath}/${this.path}/${slug}.svx`
      );

      return {
        content: post.default,
        meta: post.metadata as Item
      };
    } catch (e: unknown) {
      throw Error(`Could not find ${slug}`, { cause: e });
    }
  }
}

export default Collection;
