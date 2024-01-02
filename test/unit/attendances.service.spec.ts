import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from '../../src/attendances/attendances.service';
import { Attendance } from '../../src/attendances/entities/attendance.entity';
import { UserAttendance } from '../../src/attendances/entities/user-attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';
import { CreateAttendanceDto } from '../../src/attendances/dto/create-attendance.dto';
import { User } from '../../src/users/entities/user.entity';
import { AttendanceType } from '../../src/attendances/attendance-type.enum';

describe('AttendancesService', () => {
  let service: AttendancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // TypeOrmModule.forRoot <- DB 커넥션을 위해 AppModule import
        AppModule,
        TypeOrmModule.forFeature([Attendance, UserAttendance]),
      ],
      providers: [AttendancesService],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('어드민 권한으로 출석부를 생성한다.', async () => {
    // given
    const createAttendanceDto = new CreateAttendanceDto();
    createAttendanceDto.title = 'test title';
    createAttendanceDto.description = 'test description';
    createAttendanceDto.type = AttendanceType.WEEKDAY;

    const user = new User();
    user.id = 'user id';

    // when
    const sut = await service.create(createAttendanceDto, user);

    // then
    expect(service.findOne({ userNo: user.id })).toBeInstanceOf(Attendance);
  });
});
