import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories-repository';

@Injectable()
export class CreateCategoryService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ name, userId }: { name: string; userId: string }) {
    const category = await this.categoriesRepository.create({
      name,
      userId,
    });

    return { category };
  }
}
