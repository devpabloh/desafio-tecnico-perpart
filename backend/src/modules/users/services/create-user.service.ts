import { Injectable, ConflictException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import type { UsersRepository } from '../repositories/users-repository';

@Injectable()
export class CreateUserService {
  constructor(private userRepository: UsersRepository) {}

  async execute({ name, email, password, role }) {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ConflictException('E-mail already exists.');
    }

    const passwordHash = await hash(password, 6);

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
      role: role ?? 'USER',
    });

    return { user };
  }
}
