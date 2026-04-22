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

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductService } from '../services/create-product.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from 'src/@shared/pipes/zod-validation.pipe';
import {
  createProductSchema,
  type CreateProductDTO,
} from '../dtos/create-product.dto';
import { ApiOperation } from '@nestjs/swagger';
import { type FetchProductsService } from '../services/fetch-products.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private createProductService: CreateProductService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async create(@Body() data: CreateProductDTO, @Request() req: any) {
    const userId = req.user.id;

    return await this.createProductService.execute({
      ...data,
      userId,
    });
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
    }),
  )
  async uploadFile(
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
    return await this.FetchProductsService.execute({
      page: page ? Number(page) : 1,
      query,
      categoryId,
    });
  }
}
