import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
