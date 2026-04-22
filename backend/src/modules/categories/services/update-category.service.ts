import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CategoriesRepository } from '../repositories/categories-repository';

interface UpdateCategoryRequest {
  id: string;
  name?: string;
  actorId: string;
  actorRole: Role;
}

@Injectable()
export class UpdateCategoryService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ id, name, actorId, actorRole }: UpdateCategoryRequest) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    if (actorRole !== Role.ADMIN && category.userId !== actorId) {
      throw new ForbiddenException('You cannot update this category.');
    }

    const updatedCategory = await this.categoriesRepository.update(id, {
      name,
    });

    return { category: updatedCategory };
  }
}
