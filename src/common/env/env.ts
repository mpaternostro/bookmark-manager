import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string(),
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: z.string(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  PASSWORD_SALT: z.coerce.number(),
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
});

export type Env = z.infer<typeof envSchema>;
