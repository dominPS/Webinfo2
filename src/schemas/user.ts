import { z } from 'zod';

export const UserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
});

export type User = z.infer<typeof UserSchema>;