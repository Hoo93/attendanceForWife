import { Test, TestingModule } from '@nestjs/testing';
import { AttendeesService } from '../../../src/attendees/attendees.service';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { User } from '../../../src/users/entities/user.entity';
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

    await setupTest();
  });

  afterEach(async () => {
// Truncate tables after each test
    await clear();
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

  describe('findAllByAttendanceId Test', () => {
    it('출석부에 해당된 모든 출석 대상을 조사한다.', async () => {
      // given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const createAttendeeDto_1 = new CreateAttendeeDto();
      createAttendeeDto_1.name = '가나다';
      createAttendeeDto_1.description = '가나다 학생';
      createAttendeeDto_1.age = 3;
      createAttendeeDto_1.attendanceId = 'testAttendanceId';

      const createAttendeeDto_2 = new CreateAttendeeDto();
      createAttendeeDto_2.name = '라마바';
      createAttendeeDto_2.description = '라마바 학생';
      createAttendeeDto_2.age = 4;
      createAttendeeDto_2.attendanceId = 'testAttendanceId';

      const createAttendeeDto_3 = new CreateAttendeeDto();
      createAttendeeDto_3.name = '아자차';
      createAttendeeDto_3.description = '아자차 학생';
      createAttendeeDto_3.age = 5;
      createAttendeeDto_3.attendanceId = 'notTestAttendanceId';

      await service.createAttendee(createAttendeeDto_1, user_1);
      await service.createAttendee(createAttendeeDto_2, user_1);
      await service.createAttendee(createAttendeeDto_3, user_1);

      // when
      const sut = await service.findAllByAttendanceId(attendance.id);
      const sutAttendeeList = sut[0];
      const sutAttendeeCount = sut[1];

      // then
      expect(sutAttendeeCount).toBe(2);
      sutAttendeeList.forEach((data) => {
        expect(data.attendanceId).toBe('testAttendanceId');
      });
    });
  });

  async function setupTest() {
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
    await attendanceRepository.query(
        `INSERT INTO attendance SET
        id = 'notTestAttendanceId',
        title = 'testAttendanceTitle2',
        description = 'description',
        type = 'weekday',
        createId = 'user id 1',
        createdAt = NOW();`,
    );
  }

  async function clear() {
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance');
    await userRepository.query(`DELETE FROM user;`);
  }
});
