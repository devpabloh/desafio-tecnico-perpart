import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';

@Injectable()
export class ListMyFavoritesService {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ userId }: { userId: string }) {
    const products = await this.productsRepository.listFavoritesByUser(userId);
    return { products };
  }
}
