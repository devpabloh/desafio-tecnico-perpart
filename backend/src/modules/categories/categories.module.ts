import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CategoriesController } from './controllers/categories.controller';
import { CreateCategoryService } from './services/create-category.service';
import { CategoriesRepository } from './repositories/categories-repository';
import { PrismaCategoriesRepository } from './repositories/prisma/prisma-categories-repository';
import { FetchCategoriesService } from './services/fetch-categories.service';
import { GetCategoryByIdService } from './services/get-category-by-id.service';
import { UpdateCategoryService } from './services/update-category.service';
import { DeleteCategoryService } from './services/delete-category.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [
    CreateCategoryService,
    FetchCategoriesService,
    GetCategoryByIdService,
    UpdateCategoryService,
    DeleteCategoryService,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
  ],
  exports: [CategoriesRepository],
})
export class CategoriesModule {}
