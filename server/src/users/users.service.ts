import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Pagination } from '../common/pagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(pagination: Pagination) {
    const [list, count] = await this.userRepository.findAndCount({
      ...pagination,
    });

    return {
      list: list,
      count: count,
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
