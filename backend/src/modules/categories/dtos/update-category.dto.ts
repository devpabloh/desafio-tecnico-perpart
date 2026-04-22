import { z } from 'zod';

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(3, 'O nome da categoria deve ter pelo menos 3 caracteres')
    .optional(),
});

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
