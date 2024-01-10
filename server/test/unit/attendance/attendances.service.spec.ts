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
        id = 'user id 1' , 
        username = 'test id',
        password = 'testPWD',
        mobileNumber = '010-8098-1398',
        name = 'test name',
        createId ='user id'`,
    );

    await userRepository.query(
      `INSERT INTO user SET 
        id = 'user id 2' , 
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

  describe('createAttendance Test', () => {
    it('출석부 테이블에 출석부를 생성한다.', async () => {
      // given
      const createAttendanceDto = new CreateAttendanceDto();
      createAttendanceDto.title = 'test title';
      createAttendanceDto.description = 'test description';
      createAttendanceDto.type = AttendanceType.WEEKDAY;

      const user = new User();
      user.id = 'user id 1';

      // when
      const createdAttendanceId = await service.create(
        createAttendanceDto,
        user,
      );

      const newAttendance = await service.findOneById(createdAttendanceId.id);

      // then
      expect(newAttendance.title).toBe('test title');
      expect(newAttendance.description).toBe('test description');
      expect(newAttendance.type).toBe(AttendanceType.WEEKDAY);
    });

    it('UserAttendance 테이블에 Admin 권한으로 데이터가 생성된다.', async () => {
      // given
      const createAttendanceDto = new CreateAttendanceDto();
      createAttendanceDto.title = 'test title';
      createAttendanceDto.description = 'test description';
      createAttendanceDto.type = AttendanceType.WEEKDAY;

      const user = new User();
      user.id = 'user id 1';

      // when
      const createdAttendanceId = await service.create(
        createAttendanceDto,
        user,
      );

      const userAttendance = await userAttendanceRepository.query(
        `SELECT * FROM user_attendance WHERE userId = 'user id 1'`,
      );

      // then
      expect(userAttendance[0].role).toBe(RoleType.ADMIN);
      expect(userAttendance[0].attendanceId).toBe(createdAttendanceId.id);
    });
  });

  describe('findAllByUserId Test', () => {
    it('회원의 id로 생성된 모든 출석부를 조회한다.', async () => {
      // given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const user_2 = new User();
      user_2.id = 'user id 2';

      const createAttendanceDto_1 = new CreateAttendanceDto();
      createAttendanceDto_1.title = 'test title 1';
      createAttendanceDto_1.description = 'test description';
      createAttendanceDto_1.type = AttendanceType.WEEKDAY;

      const createAttendanceDto_2 = new CreateAttendanceDto();
      createAttendanceDto_2.title = 'test title 2';
      createAttendanceDto_2.description = 'test description';
      createAttendanceDto_2.type = AttendanceType.WEEKDAY;

      const createAttendanceDto_3 = new CreateAttendanceDto();
      createAttendanceDto_3.title = 'test title 3';
      createAttendanceDto_3.description = 'test description';
      createAttendanceDto_3.type = AttendanceType.WEEKDAY;

      await service.create(createAttendanceDto_1, user_1);
      await service.create(createAttendanceDto_2, user_1);
      await service.create(createAttendanceDto_3, user_2);

      // when
      const sut = await service.findAllByUserId(user_1.id);
      // then
      expect(sut).toHaveLength(2);
      sut.forEach((data) => {
        expect(data.attendance.createId).not.toBe(user_2.id);
        expect(data.attendance.createId).toBe(user_1.id);
      });
    });
  });
});
