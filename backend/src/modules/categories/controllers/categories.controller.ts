import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UsePipes,
  Get,
} from '@nestjs/common';
import { CreateCategoryService } from '../services/create-category.service';
import { CategoriesRepository } from '../repositories/categories-repository';
import {
  createCategorySchema,
  type CreateCategoryDTO,
} from '../dtos/create-category.dto';
import { ZodValidationPipe } from 'src/@shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private createCategoryService: CreateCategoryService,
    private categoriesRepository: CategoriesRepository,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async create(@Body() data: CreateCategoryDTO, @Request() req: any) {
    return await this.createCategoryService.execute({
      name: data.name,
      userId: req.user.id, // O ID vem do token JWT
    });
  }

  @Get()
  async listAll() {
    return await this.categoriesRepository.findMany();
  }
}
