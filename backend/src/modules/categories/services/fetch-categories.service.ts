import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories-repository';

interface FetchCategoriesRequest {
  page?: number;
  query?: string;
}

@Injectable()
export class FetchCategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ page, query }: FetchCategoriesRequest) {
    const categories = await this.categoriesRepository.findMany({
      page: page ?? 1,
      query,
    });

    return { categories };
  }
}
