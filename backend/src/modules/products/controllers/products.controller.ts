import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UsePipes,
  UseInterceptors,
  Param,
  UploadedFile,
  Get,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from 'src/@shared/pipes/zod-validation.pipe';

import { CreateProductService } from '../services/create-product.service';
import { FetchProductsService } from '../services/fetch-products.service';
import { GetProductByIdService } from '../services/get-product-by-id.service';
import { UpdateProductService } from '../services/update-product.service';
import { DeleteProductService } from '../services/delete-product.service';
import { FavoriteProductService } from '../services/favorite-product.service';
import { UnfavoriteProductService } from '../services/unfavorite-product.service';
import { ListMyFavoritesService } from '../services/list-my-favorites.service';

import {
  createProductSchema,
  type CreateProductDTO,
} from '../dtos/create-product.dto';
import {
  updateProductSchema,
  type UpdateProductDTO,
} from '../dtos/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(
    private createProductService: CreateProductService,
    private fetchProductsService: FetchProductsService,
    private getProductByIdService: GetProductByIdService,
    private updateProductService: UpdateProductService,
    private deleteProductService: DeleteProductService,
    private favoriteProductService: FavoriteProductService,
    private unfavoriteProductService: UnfavoriteProductService,
    private listMyFavoritesService: ListMyFavoritesService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async create(@Body() data: CreateProductDTO, @Request() req: any) {
    return this.createProductService.execute({
      ...data,
      userId: req.user.id,
    });
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
    }),
  )
  uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Upload realizado com sucesso',
      fileName: file.filename,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lista produtos com filtros e paginação' })
  async fetch(
    @Query('page') page: string,
    @Query('query') query: string,
    @Query('categoryId') categoryId: string,
  ) {
    return this.fetchProductsService.execute({
      page: page ? Number(page) : 1,
      query,
      categoryId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca produto por id' })
  async getById(@Param('id') id: string) {
    return this.getProductByIdService.execute({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza produto por id' })
  @UsePipes(new ZodValidationPipe(updateProductSchema))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDTO,
    @Request() req: any,
  ) {
    return this.updateProductService.execute({
      id,
      title: body.title,
      description: body.description,
      categoryIds: body.categoryIds,
      actorId: req.user.id,
      actorRole: req.user.role,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove produto por id' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.deleteProductService.execute({
      id,
      actorId: req.user.id,
      actorRole: req.user.role,
    });
  }

  @Post(':id/favorite')
  async favorite(@Param('id') id: string, @Request() req: any) {
    return this.favoriteProductService.execute({
      productId: id,
      userId: req.user.id,
    });
  }

  @Delete(':id/favorite')
  async unfavorite(@Param('id') id: string, @Request() req: any) {
    return this.unfavoriteProductService.execute({
      productId: id,
      userId: req.user.id,
    });
  }

  @Get('me/favorites')
  async listMyFavorites(@Request() req: any) {
    return this.listMyFavoritesService.execute({ userId: req.user.id });
  }
}
