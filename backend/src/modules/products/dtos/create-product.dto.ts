import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ser mais detalhada'),
  categoryIds: z.array(z.string().uuid()).default([]),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;
