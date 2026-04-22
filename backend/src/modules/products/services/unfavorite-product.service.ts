import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';

@Injectable()
export class UnfavoriteProductService {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ productId, userId }: { productId: string; userId: string }) {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const alreadyFavorited = await this.productsRepository.isFavoritedByUser(
      productId,
      userId,
    );

    if (!alreadyFavorited) {
      throw new NotFoundException('Favorite not found.');
    }

    await this.productsRepository.removeFavorite(productId, userId);

    return { message: 'Product unfavorited successfully.' };
  }
}
