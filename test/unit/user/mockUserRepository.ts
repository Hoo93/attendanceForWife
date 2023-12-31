import { User } from '../../../src/users/entities/user.entity';
import { CreateAuthDto } from '../../../src/auth/dto/create-auth.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Pagination } from '../../../src/common/pagination';

export class MockUserRepository {
  private users: User[] = [
    plainToClass(User, {
      id: 'TEST_1',
      username: 'TestUser1',
      password: 'pwd123!@#',
      email: 'email@gmail.com',
      birthday: '931117',
      mobileNumber: '010-8098-1398',
    }),
    plainToClass(User, {
      id: 'TEST_2',
      username: 'TestUser2',
      password: 'pwd123!@#',
      email: 'test@gmail.com',
      birthday: '930519',
      mobileNumber: '010-1234-1398',
    }),
    plainToClass(User, {
      id: 'TEST_3',
      username: 'TestUser3',
      password: 'pwd123!@#',
      email: 'default@gmail.com',
      birthday: '890222',
      mobileNumber: '010-5678-1398',
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
    const property = Object.keys(options)[0];

    const user: User = this.users.find(
      (user) => user[property] === options.where[property],
    );
    if (!user) {
      throw new NotFoundException('해당 ID의 유저가 없습니다.');
    }
    const { password, ...result } = user;
    return result;
  }

  public async findAndCount(options) {
    const list = this.users.slice(options.skip, options.skip + options.take);
    const count = this.users.length;
    return [list, count];
  }
}
