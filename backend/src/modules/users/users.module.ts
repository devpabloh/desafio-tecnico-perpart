import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { CreateUserService } from './services/create-user.service';
import { UsersRepository } from './repositories/users-repository';
import { PrismaUsersRepository } from './repositories/prisma/prisma-users-repository';
import { DatabaseModule } from 'src/infra/database/database.module';
import { FetchUsersService } from './services/fetch-users.service';
import { GetUserByIdService } from './services/get-user-by-id.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    CreateUserService,
    FetchUsersService,
    GetUserByIdService,
    UpdateUserService,
    DeleteUserService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
