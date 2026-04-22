import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ProductsRepository } from '../repositories/products-repository';

interface UpdateProductRequest {
  id: string;
  title?: string;
  description?: string;
  categoryIds?: string[];
  actorId: string;
  actorRole: Role;
}

@Injectable()
export class UpdateProductService {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    id,
    title,
    description,
    categoryIds,
    actorId,
    actorRole,
  }: UpdateProductRequest) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (actorRole !== Role.ADMIN && product.userId !== actorId) {
      throw new ForbiddenException('You cannot update this product.');
    }

    const updatedProduct = await this.productsRepository.update(id, {
      title,
      description,
      categories: categoryIds
        ? {
            set: categoryIds.map((categoryId) => ({ id: categoryId })),
          }
        : undefined,
    });

    return { product: updatedProduct };
  }
}
