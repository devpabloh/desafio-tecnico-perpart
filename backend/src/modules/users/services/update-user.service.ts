import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';
import { UsersRepository } from '../repositories/users-repository';

interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

@Injectable()
export class UpdateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id, name, email, password, role }: UpdateUserRequest) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (email && email !== user.email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email);

      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ConflictException('E-mail already exists.');
      }
    }

    const passwordHash = password ? await hash(password, 6) : undefined;

    const updatedUser = await this.usersRepository.update(id, {
      name,
      email,
      password: passwordHash,
      role,
    });

    return { user: updatedUser };
  }
}
