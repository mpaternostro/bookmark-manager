import { z } from 'zod';

export const updateUserSchema = z.object({
  password: z.string().min(8),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
