import { z } from 'zod';

export const updateBookmarkSchema = z
  .object({
    url: z.string().url(),
    title: z.string(),
    description: z.string(),
  })
  .partial();

export type UpdateBookmarkDto = z.infer<typeof updateBookmarkSchema>;
