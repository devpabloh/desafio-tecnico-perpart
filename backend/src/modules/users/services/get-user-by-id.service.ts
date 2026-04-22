import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

@Injectable()
export class GetUserByIdService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: { id: string }) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return { user };
  }
}
