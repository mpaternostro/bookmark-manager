import { z } from 'zod';

export const updateBookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
});

export type UpdateBookmarkDto = z.infer<typeof updateBookmarkSchema>;
