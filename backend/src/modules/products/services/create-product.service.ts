import { Injectable } from '@nestjs/common';
import type { ProductsRepository } from '../repositories/products-repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CreateProductService {
  constructor(
    private productsRepository: ProductsRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ title, description, userId, categoryIds }) {
    const product = await this.productsRepository.create({
      title,
      description,
      userId,

      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
    });

    this.eventEmitter.emit('product.created', {
      productId: product.id,
      userId: product.userId,
      title: product.title,
      description: product.description,
    });

    return { product };
  }
}
