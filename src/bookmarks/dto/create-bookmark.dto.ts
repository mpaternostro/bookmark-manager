import { z } from 'zod';

export const createBookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
});

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;
