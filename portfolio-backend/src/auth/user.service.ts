import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | undefined> {
    const numericId = parseInt(id, 10);
    return this.userRepository.findOne({ where: { id: numericId } });
  }

  async findByUserName(userName: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { userName } });
  }

  async register(userDetails: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userDetails);
    return this.userRepository.save(newUser);
  }
}