import { Prisma, Category } from '@prisma/client';

export abstract class CategoriesRepository {
  abstract create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>;
  abstract findById(id: string): Promise<Category | null>;
  abstract findMany(): Promise<Category[]>;
}
