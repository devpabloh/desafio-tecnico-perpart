import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';

interface FetchProductsRequest {
  page?: number;
  query?: string;
  categoryId?: string;
}

@Injectable()
export class FetchProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ page, query, categoryId }: FetchProductsRequest) {
    const products = await this.productsRepository.findMany({
      page: page ?? 1,
      query,
      categoryId,
    });

    return { products };
  }
}
