import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from '../../../src/attendances/attendances.service';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { UserAttendance } from '../../../src/attendances/entities/user-attendance.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../../src/app.module';
import { CreateAttendanceDto } from '../../../src/attendances/dto/create-attendance.dto';
import { User } from '../../../src/users/entities/user.entity';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';
import { RoleType } from '../../../src/roles/role-type.enum';
import { TestModule } from '../../../src/test.module';

describe('AttendancesService', () => {
  let service: AttendancesService;
  let attendanceRepository;
  let userAttendanceRepository;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // TypeOrmModule.forRoot <- DB 커넥션을 위해 AppModule import
        TestModule,
        TypeOrmModule.forFeature([Attendance, UserAttendance, User]),
      ],
      providers: [AttendancesService],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    attendanceRepository = module.get(getRepositoryToken(Attendance));
    userAttendanceRepository = module.get(getRepositoryToken(UserAttendance));
    userRepository = module.get(getRepositoryToken(User));

    await userRepository.query(
      `INSERT INTO user SET 
        id = 'user id' , 
        username = 'test id',
        password = 'testPWD',
        mobileNumber = '010-8098-1398',
        name = 'test name',
        createId ='user id'`,
    );
  });

  afterEach(async () => {
    // Truncate tables after each test
    await userAttendanceRepository.query('DELETE FROM user_attendance;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('출석부 테이블에 출석부를 생성한다.', async () => {
    // given
    const createAttendanceDto = new CreateAttendanceDto();
    createAttendanceDto.title = 'test title';
    createAttendanceDto.description = 'test description';
    createAttendanceDto.type = AttendanceType.WEEKDAY;

    const user = new User();
    user.id = 'user id';

    // when
    const createdAttendanceId = await service.create(createAttendanceDto, user);

    const newAttendance = await service.findOneById(createdAttendanceId.id);

    // then
    expect(newAttendance.title).toBe('test title');
    expect(newAttendance.description).toBe('test description');
    expect(newAttendance.type).toBe(AttendanceType.WEEKDAY);
  });

  it('출석부를 생성하면 조인테이블에 데이터가 생성된다.', async () => {
    // given
    const createAttendanceDto = new CreateAttendanceDto();
    createAttendanceDto.title = 'test title';
    createAttendanceDto.description = 'test description';
    createAttendanceDto.type = AttendanceType.WEEKDAY;

    const user = new User();
    user.id = 'user id';

    // when
    const createdAttendanceId = await service.create(createAttendanceDto, user);

    const userAttendance = await userAttendanceRepository.query(
      `SELECT * FROM user_attendance WHERE userId = 'user id'`,
    );

    // then
    expect(userAttendance[0].role).toBe(RoleType.ADMIN);
    expect(userAttendance[0].attendanceId).toBe(createdAttendanceId.id);
  });
});
