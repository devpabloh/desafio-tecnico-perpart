import { Injectable } from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CategoriesRepository } from '../categories-repository';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category> {
    return await this.prisma.category.create({ data });
  }

  async findById(id: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findMany(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
