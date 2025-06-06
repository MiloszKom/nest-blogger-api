import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  createUser(username: string, email: string, password: string) {
    const user = this.usersRepository.create({ username, email, password });
    return this.usersRepository.save(user);
  }

  async findUser(id: number) {
    const userWithPosts = await this.usersRepository.findOne({
      where: { id },
      relations: ['posts'],
    });

    if (!userWithPosts) {
      throw new NotFoundException('User not found');
    }

    return userWithPosts;
  }
}
