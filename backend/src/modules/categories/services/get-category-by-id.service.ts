import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories-repository';

@Injectable()
export class GetCategoryByIdService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ id }: { id: string }) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return { category };
  }
}
