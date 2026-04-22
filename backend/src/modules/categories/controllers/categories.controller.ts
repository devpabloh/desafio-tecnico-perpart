import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UsePipes,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateCategoryService } from '../services/create-category.service';
import { FetchCategoriesService } from '../services/fetch-categories.service';
import { GetCategoryByIdService } from '../services/get-category-by-id.service';
import { UpdateCategoryService } from '../services/update-category.service';
import { DeleteCategoryService } from '../services/delete-category.service';
import {
  createCategorySchema,
  type CreateCategoryDTO,
} from '../dtos/create-category.dto';
import {
  updateCategorySchema,
  type UpdateCategoryDTO,
} from '../dtos/update-category.dto';
import { ZodValidationPipe } from 'src/@shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private createCategoryService: CreateCategoryService,
    private fetchCategoriesService: FetchCategoriesService,
    private getCategoryByIdService: GetCategoryByIdService,
    private updateCategoryService: UpdateCategoryService,
    private deleteCategoryService: DeleteCategoryService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async create(@Body() data: CreateCategoryDTO, @Request() req: any) {
    return this.createCategoryService.execute({
      name: data.name,
      userId: req.user.id,
    });
  }

  @Get()
  async listAll(@Query('page') page?: string, @Query('query') query?: string) {
    return this.fetchCategoriesService.execute({
      page: page ? Number(page) : 1,
      query,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getCategoryByIdService.execute({ id });
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDTO,
    @Request() req: any,
  ) {
    return this.updateCategoryService.execute({
      id,
      name: body.name,
      actorId: req.user.id,
      actorRole: req.user.role,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.deleteCategoryService.execute({
      id,
      actorId: req.user.id,
      actorRole: req.user.role,
    });
  }
}
