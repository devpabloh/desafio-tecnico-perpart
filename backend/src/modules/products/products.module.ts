import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductsController } from './controllers/products.controller';
import { CreateProductService } from './services/create-product.service';
import { ProductsRepository } from './repositories/products-repository';
import { PrismaProductsRepository } from './repositories/prisma/prisma-products-repository';
import { DatabaseModule } from 'src/infra/database/database.module';
import { FetchProductsService } from './services/fetch-products.service';
import { GetProductByIdService } from './services/get-product-by-id.service';
import { UpdateProductService } from './services/update-product.service';
import { DeleteProductService } from './services/delete-product.service';
import { FavoriteProductService } from './services/favorite-product.service';
import { UnfavoriteProductService } from './services/unfavorite-product.service';
import { ListMyFavoritesService } from './services/list-my-favorites.service';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [ProductsController],
  providers: [
    CreateProductService,
    FetchProductsService,
    GetProductByIdService,
    UpdateProductService,
    DeleteProductService,
    FavoriteProductService,
    UnfavoriteProductService,
    ListMyFavoritesService,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [ProductsRepository],
})
export class ProductsModule {}
