import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
