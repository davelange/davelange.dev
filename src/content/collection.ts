import * as z from "zod";

type CollectionOptions<
  T extends z.ZodObject,
  F extends keyof z.infer<T>
> = {
  path: string;
  schema: T;
  dimensions: Array<F>;
};

class Collection<
  T extends z.ZodObject,
  F extends keyof z.infer<T>,
  Item extends z.infer<T> & { slug: string }
> {
  static basePath = "/src/content";

  path = "";
  schema: z.ZodObject;
  entries: Array<Item> = [];
  dimensions = new Map<F, Set<Item[F]>>();

  constructor(options: CollectionOptions<T, F>) {
    this.schema = options.schema.extend({
      slug: z.string()
    });
    this.path = options.path;

    // Initialize properties
    options.dimensions.map((property) => {
      this.dimensions.set(property, new Set<Item[F]>());
    });

    this.entries = this.compileEntries();
  }

  compileEntries() {
    const entries: Array<Item> = [];
    const paths = import.meta.glob(`/src/content/**/*.svx`, {
      eager: true
    });

    for (const path in paths) {
      if (!path.includes(`/src/content/${this.path}`)) continue;

      const file = paths[path] as { metadata: Item };
      const slug = path.split("/").at(-1)?.replace(".svx", "");
      const metadata = file.metadata as Item;
      const item = { ...metadata, slug } as Item;

      this.dimensions.forEach((value, key) => {
        if (metadata[key]) value.add(metadata[key]);
      });

      entries.push(z.parse(this.schema, item) as Item);
    }

    return entries;
  }

  getEntries(options?: {
    filter?: Partial<Record<F, Item[F]>>;
    sort?: {
      by: keyof Item;
      order: "asc" | "desc";
    };
    limit?: number;
  }) {
    if (!options) {
      return this.entries;
    }

    let out = this.entries;

    if (options.filter) {
      out = out.filter((item) => {
        for (const filterKey in options.filter) {
          if (Array.isArray(item[filterKey as F])) {
            if (
              (item[filterKey] as Array<Item[F]>).some((a) =>
                (
                  options.filter![filterKey] as Array<Item[F]>
                ).includes(a)
              )
            ) {
              return true;
            }
          }

          if (item[filterKey as F] === options.filter[filterKey]) {
            return true;
          }

          return false;
        }
      });
    }

    if (options.sort) {
      const { by, order } = options.sort;

      out = out.sort((a, b) => {
        if (order === "asc") {
          return a[by] < b[by] ? -1 : 1;
        }

        return a[by] > b[by] ? -1 : 1;
      });
    }

    if (options.limit) {
      out = out.slice(0, options.limit);
    }

    return out;
  }

  getProperties(key: F) {
    return this.dimensions.get(key)?.values().toArray().flat() || [];
  }

  async getEntry(slug: string) {
    if (!this.entries.find((item) => item.slug === slug)) {
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
