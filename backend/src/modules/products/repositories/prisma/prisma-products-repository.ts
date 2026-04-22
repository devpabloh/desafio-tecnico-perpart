import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import {
  FindManyProductsParams,
  ProductsRepository,
} from '../products-repository';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}
  async findMany({ page, query, categoryId }: FindManyProductsParams) {
    const products = await this.prisma.product.findMany({
      where: {
        OR: query
          ? [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ]
          : undefined,

        categories: categoryId
          ? {
              some: { id: categoryId },
            }
          : undefined,
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        categories: true,
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    return await this.prisma.product.create({ data });
  }

  async findById(id: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async update(
    id: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async isFavoritedByUser(productId: string, userId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!favorite;
  }

  async addFavorite(productId: string, userId: string): Promise<void> {
    await this.prisma.favorite.create({
      data: { productId, userId },
    });
  }

  async removeFavorite(productId: string, userId: string): Promise<void> {
    await this.prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async listFavoritesByUser(userId: string): Promise<Product[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            categories: true,
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return favorites.map((item) => item.product);
  }
}
