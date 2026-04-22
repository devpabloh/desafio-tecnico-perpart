import { z } from 'zod';

export const updateProductSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .optional(),
  description: z
    .string()
    .min(10, 'A descrição deve ser mais detalhada')
    .optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
