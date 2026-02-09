import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      thumbnail: z.string().optional(),
      bookmark: z.boolean().optional(),
      order: z.number().optional(),
      draft: z.boolean().optional().default(false),
      summary: z.string().optional(),
      categoryPath: z.array(z.string()).optional(),
      legacy_url: z.string().optional()
    })
    .passthrough()
});

export const collections = {
  posts
};
