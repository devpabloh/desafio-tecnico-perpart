import { Prisma, Category } from '@prisma/client';

export interface FindManyCategoriesParams {
  page: number;
  query?: string;
}

export abstract class CategoriesRepository {
  abstract create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>;
  abstract findById(id: string): Promise<Category | null>;
  abstract findMany(params: FindManyCategoriesParams): Promise<Category[]>;
  abstract update(
    id: string,
    data: Prisma.CategoryUncheckedUpdateInput,
  ): Promise<Category>;
  abstract delete(id: string): Promise<void>;
}
