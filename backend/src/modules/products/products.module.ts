import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductsController } from './controllers/products.controller';
import { CreateProductService } from './services/create-product.service';
import { ProductsRepository } from './repositories/products-repository';
import { PrismaProductsRepository } from './repositories/prisma/prisma-products-repository';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [ProductsController],
  providers: [
    CreateProductService,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [ProductsRepository],
})
export class ProductsModule {}
