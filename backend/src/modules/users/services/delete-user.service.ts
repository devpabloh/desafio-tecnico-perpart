import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

@Injectable()
export class DeleteUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: { id: string }) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.usersRepository.delete(id);

    return { message: 'User deleted successfully.' };
  }
}
