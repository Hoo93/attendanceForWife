import { User } from '../users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

export class MockUserRepository {
  private users: User[] = [
    plainToClass(User, {
      id: 'TestUser1',
      password: 'pwd123!@#',
      email: 'email@gmail.com',
      birthday: '931117',
      mobileNumber: '010-8098-1398',
    }),
    plainToClass(User, {
      id: 'TestUser2',
      password: 'pwd123!@#',
      email: 'email@gmail.com',
      birthday: '931117',
      mobileNumber: '010-8098-1398',
    }),
    plainToClass(User, {
      id: 'TestUser3',
      password: 'pwd123!@#',
      email: 'email@gmail.com',
      birthday: '931117',
      mobileNumber: '010-8098-1398',
    }),
  ];

  public setTestUser(user: User) {
    this.users.push(user);
    return this.users;
  }

  public async save(createAuthDto: CreateAuthDto) {
    const { password, ...result } = createAuthDto;
    return result;
  }

  public async findOne(options) {
    const user: User = this.users.find((user) => user.id === options.where.id);
    if (!user) {
      throw new NotFoundException('해당 ID의 유저가 없습니다.');
    }
    const { password, ...result } = user;
    return result;
  }
}
