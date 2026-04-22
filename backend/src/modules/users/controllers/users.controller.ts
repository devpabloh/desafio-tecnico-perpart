import {
  Controller,
  Post,
  Body,
  UsePipes,
  ConflictException,
  UseInterceptors,
  UploadedFile,
  Param,
  UseGuards,
  Get,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CreateUserService } from '../services/create-user.service';
import { FetchUsersService } from '../services/fetch-users.service';
import { GetUserByIdService } from '../services/get-user-by-id.service';
import { UpdateUserService } from '../services/update-user.service';
import { DeleteUserService } from '../services/delete-user.service';

import * as createUserDto from '../dtos/create-user.dto';
import { updateUserSchema, type UpdateUserDto } from '../dtos/update-user.dto';

import { ZodValidationPipe } from 'src/@shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(
    private createUserService: CreateUserService,
    private fetchUsersService: FetchUsersService,
    private getUserByIdService: GetUserByIdService,
    private updateUserService: UpdateUserService,
    private deleteUserService: DeleteUserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @UsePipes(new ZodValidationPipe(createUserDto.createUserSchema))
  async create(@Body() body: createUserDto.CreateUserDto) {
    try {
      return await this.createUserService.execute(body);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erro interno do servidor');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lista usuários com paginação e busca' })
  async fetch(@Query('page') page?: string, @Query('query') query?: string) {
    return this.fetchUsersService.execute({
      page: page ? Number(page) : 1,
      query,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário por id' })
  async getById(@Param('id') id: string) {
    return this.getUserByIdService.execute({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza usuário por id' })
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.updateUserService.execute({ id, ...body });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove usuário por id' })
  async delete(@Param('id') id: string) {
    return this.deleteUserService.execute({ id });
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload de avatar do usuário' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/avatars',
    }),
  )
  uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Avatar atualizado',
      fileName: file.filename,
    };
  }
}
