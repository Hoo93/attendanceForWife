import { Test, TestingModule } from '@nestjs/testing';
import { AttendeesService } from '../../../src/attendees/attendees.service';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { User } from '../../../src/users/entities/user.entity';
import { UserAttendance } from '../../../src/attendances/entities/user-attendance.entity';
import { CreateAttendeeDto } from '../../../src/attendees/dto/create-attendee.dto';

describe('AttendeesService', () => {
  let service: AttendeesService;
  let attendeeRepository;
  let attendanceRepository;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Attendee, User])],
      providers: [AttendeesService],
    }).compile();

    service = module.get<AttendeesService>(AttendeesService);
    attendeeRepository = module.get(getRepositoryToken(Attendee));
    attendanceRepository = module.get(getRepositoryToken(Attendance));
    userRepository = module.get(getRepositoryToken(User));

    await attendanceRepository.query('DELETE FROM attendance');
    await userRepository.query(`DELETE FROM user;`);

    await userRepository.query(
      `INSERT INTO user SET 
        id = 'user id 1' , 
        username = 'test id',
        password = 'testPWD',
        mobileNumber = '010-8098-1398',
        name = 'test name',
        createId ='user id'`,
    );

    await attendanceRepository.query(
      `INSERT INTO attendance SET
        id = 'testAttendanceId',
        title = 'testAttendanceTitle',
        description = 'description',
        type = 'weekday',
        createId = 'user id 1',
        createdAt = NOW();`,
    );
  });

  afterEach(async () => {
    // Truncate tables after each test
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance');
    await userRepository.query(`DELETE FROM user;`);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAttendee Test ', () => {
    it('출석 대상 테이블에 출석 대상자를 생성한다.', async () => {
      // given
      const createAttendeeDto = new CreateAttendeeDto();
      createAttendeeDto.name = 'test name';
      createAttendeeDto.description = 'this is first attendee';
      createAttendeeDto.attendanceId = 'testAttendanceId';
      createAttendeeDto.age = 15;

      const user = new User();
      user.id = 'user id 1';

      // when
      const createdAttendee = await service.createAttendee(
        createAttendeeDto,
        user,
      );

      // then
      expect(createdAttendee?.name).toBe('test name');
      expect(createdAttendee?.description).toBe('this is first attendee');
      expect(createdAttendee?.createId).toBe('user id 1');
      expect(createdAttendee?.attendanceId).toBe('testAttendanceId');
    });
  });
});
