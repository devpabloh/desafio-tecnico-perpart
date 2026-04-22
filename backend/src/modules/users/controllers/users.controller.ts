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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserService } from '../services/create-user.service';
import * as createUserDto from '../dtos/create-user.dto';
import { ZodValidationPipe } from 'src/@shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private createUserService: CreateUserService) {}

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

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload de avatar do usuário' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/avatars',
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Avatar atualizado',
      fileName: file.filename,
    };
  }
}
