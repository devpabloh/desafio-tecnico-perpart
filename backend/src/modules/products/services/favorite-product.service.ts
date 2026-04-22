import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FavoriteProductService {
  constructor(
    private productsRepository: ProductsRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ productId, userId }: { productId: string; userId: string }) {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (product.userId === userId) {
      throw new BadRequestException('You cannot favorite your own product.');
    }

    const alreadyFavorited = await this.productsRepository.isFavoritedByUser(
      productId,
      userId,
    );

    if (alreadyFavorited) {
      throw new BadRequestException('Product already favorited.');
    }

    await this.productsRepository.addFavorite(productId, userId);

    this.eventEmitter.emit('product.favorited', {
      productId: product.id,
      actorUserId: userId,
      ownerUserId: product.userId,
    });

    return { message: 'Product favorited successfully.' };
  }
}
