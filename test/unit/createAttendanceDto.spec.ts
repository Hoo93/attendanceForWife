import { plainToInstance } from 'class-transformer';
import { CreateAuthDto } from '../../src/auth/dto/create-auth.dto';
import { User } from '../../src/users/entities/user.entity';
import { CreateAttendanceDto } from '../../src/attendances/dto/create-attendance.dto';

describe('create-auth.dto TEST', () => {
  let createAuthDto;

  beforeEach(() => {
    const dto = {
      title: 'test title',
      description: 'test decription',
      type: 'admin',
    };
    createAuthDto = plainToInstance(CreateAttendanceDto, dto);
  });
});
