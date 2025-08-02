import Collection from "./collection";
import * as z from "zod";

const blogPostSchema = z.object({
  title: z.string(),
  publishedAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  description: z.string(),
  canonical: z.string().optional(),

  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false)
});

export const blogPosts = new Collection({
  path: "blog",
  schema: blogPostSchema
});
