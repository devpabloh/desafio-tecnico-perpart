import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';

@Injectable()
export class GetProductByIdService {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ id }: { id: string }) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return { product };
  }
}
