import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ProductsRepository } from '../repositories/products-repository';

interface DeleteProductRequest {
  id: string;
  actorId: string;
  actorRole: Role;
}

@Injectable()
export class DeleteProductService {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ id, actorId, actorRole }: DeleteProductRequest) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (actorRole !== Role.ADMIN && product.userId !== actorId) {
      throw new ForbiddenException('You cannot delete this product.');
    }

    await this.productsRepository.delete(id);

    return { message: 'Product deleted successfully.' };
  }
}
