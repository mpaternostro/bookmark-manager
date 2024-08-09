import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string(),
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
});

export type Env = z.infer<typeof envSchema>;
