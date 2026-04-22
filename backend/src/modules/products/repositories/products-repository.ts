import { Prisma, Product } from '@prisma/client';

export interface FindManyProductsParams {
  page: number;
  query?: string;
  categoryId?: string;
}

export abstract class ProductsRepository {
  abstract create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;
  abstract findById(id: string): Promise<Product | null>;
  abstract delete(id: string): Promise<void>;
  abstract findMany(params: FindManyProductsParams): Promise<Product[]>;
}
