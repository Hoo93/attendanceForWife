import { plainToInstance } from 'class-transformer';
import { User } from '../../src/users/entities/user.entity';
import { CreateAttendanceDto } from '../../src/attendances/dto/create-attendance.dto';
import { Attendance } from '../../src/attendances/entities/attendance.entity';
import { CreateAuthDto } from '../../src/auth/dto/create-auth.dto';

describe('create-auth.dto TEST', () => {
  let createAttendanceDto;

  beforeEach(() => {
    const dto = {
      title: 'test title',
      description: 'test decription',
      type: 'admin',
    };
    createAttendanceDto = plainToInstance(CreateAttendanceDto, dto);
  });

  it('should return Attendance Object', () => {
    const sut = createAttendanceDto.toEntity();
    expect(sut).toBeInstanceOf(Attendance);
  });
});
