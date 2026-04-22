import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CategoriesRepository } from '../repositories/categories-repository';

interface DeleteCategoryRequest {
  id: string;
  actorId: string;
  actorRole: Role;
}

@Injectable()
export class DeleteCategoryService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ id, actorId, actorRole }: DeleteCategoryRequest) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    if (actorRole !== Role.ADMIN && category.userId !== actorId) {
      throw new ForbiddenException('You cannot delete this category.');
    }

    await this.categoriesRepository.delete(id);

    return { message: 'Category deleted successfully.' };
  }
}
