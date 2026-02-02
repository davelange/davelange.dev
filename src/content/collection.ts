import { error } from "@sveltejs/kit";
import * as z from "zod";

type CollectionOptions<
  T extends z.ZodObject,
  F extends keyof z.infer<T>
> = {
  path: string;
  schema: T;
  dimensions: Array<F>;
};

type Item<T> = z.infer<T> & { slug: string };
class Collection<
  T extends z.ZodObject = z.ZodObject,
  F extends keyof z.infer<T> = ""
> {
  static basePath = "/src/content";

  path = "";
  schema: z.ZodObject;
  entries: Array<Item<T>> = [];
  dimensions = new Map<F, Set<Item<T>[F]>>();

  constructor(options: CollectionOptions<T, F>) {
    this.schema = options.schema.extend({
      slug: z.string()
    });
    this.path = options.path;

    // Initialize properties
    options.dimensions.map((property) => {
      this.dimensions.set(property, new Set<Item<T>[F]>());
    });

    this.entries = this.compileEntries();
  }

  compileEntries() {
    if (import.meta.env.DEV) console.log("Compiling entries...");
    const entries: Array<Item<T>> = [];
    const paths = import.meta.glob(`/src/content/**/*.svx`, {
      eager: true
    });

    for (const path in paths) {
      if (!path.includes(`/src/content/${this.path}`)) continue;

      const file = paths[path] as { metadata: Item<T> };
      const slug = path
        .split("/")
        .at(-1)
        ?.replace(".svx", "")
        .toLowerCase();
      const metadata = file.metadata as Item<T>;
      const item = { ...metadata, slug } as Item<T>;

      this.dimensions.forEach((value, key) => {
        if (!metadata[key]) return;

        if (Array.isArray(metadata[key])) {
          metadata[key].map((value) => {
            this.dimensions.get(key)?.add(value);
          });
        } else {
          this.dimensions.get(key)?.add(metadata[key]);
        }
      });

      entries.push(z.parse(this.schema, item) as Item<T>);
    }

    return entries;
  }

  getEntries(options?: {
    filter?: Partial<Record<F, Item<T>[F]>>;
    sort?: {
      by: keyof Item<T>;
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
              (item[filterKey] as Array<Item<T>[F]>).some((a) =>
                (
                  options.filter![filterKey] as Array<Item<T>[F]>
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

  getDimensionValues(key: F) {
    return this.dimensions.get(key)?.values().toArray().flat() || [];
  }

  extractHeadings(content: string) {
    const headings = content.match(/<h2>(.*?)<\/h2>/g);
    return headings?.map((heading) =>
      heading.replace(/<h2>|<\/h2>/g, "")
    );
  }

  async getEntry(slug: string) {
    if (import.meta.env.DEV) console.warn(`Getting entry ${slug}`);

    try {
      const modules = import.meta.glob("./**/*.svx");
      const post = await modules[`./${this.path}/${slug}.svx`]();

      return {
        content: (post as { default: any }).default,
        meta: this.entries.find((item) => item.slug === slug)!
      };
    } catch (e: unknown) {
      throw error(404, {
        message: "Not Found"
      });
    }
  }
}

export type CollectionEntry<C> = C extends { getEntries: unknown }
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    C["getEntries"] extends (...args: any) => any
    ? ReturnType<C["getEntries"]>[number]
    : never
  : never;

export default Collection;
