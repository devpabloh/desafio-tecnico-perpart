import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CategoriesController } from './controllers/categories.controller';
import { CreateCategoryService } from './services/create-category.service';
import { CategoriesRepository } from './repositories/categories-repository';
import { PrismaCategoriesRepository } from './repositories/prisma/prisma-categories-repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [
    CreateCategoryService,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
  ],
  exports: [CategoriesRepository],
})
export class CategoriesModule {}
