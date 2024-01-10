import {Test, TestingModule} from '@nestjs/testing';
import {AttendeesService} from '../../../src/attendees/attendees.service';
import {TestModule} from '../../../src/test.module';
import {getDataSourceToken, getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {Attendee} from '../../../src/attendees/entities/attendee.entity';
import {Attendance} from '../../../src/attendances/entities/attendance.entity';
import {User} from '../../../src/users/entities/user.entity';
import {CreateAttendeeDto} from '../../../src/attendees/dto/create-attendee.dto';
import {AttendanceType} from "../../../src/attendances/const/attendance-type.enum";
import {DataSource} from "typeorm";
import * as module from "module";

describe('AttendeesService', () => {
  let module:TestingModule
  let service: AttendeesService;
  let attendeeRepository;
  let attendanceRepository;
  let userRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Attendee, User])],
      providers: [AttendeesService],
    }).compile();

    service = module.get<AttendeesService>(AttendeesService);
    attendeeRepository = module.get(getRepositoryToken(Attendee));
    attendanceRepository = module.get(getRepositoryToken(Attendance));
    userRepository = module.get(getRepositoryToken(User));
  })

  beforeEach(async () => {
    await setupTest();
  });

  afterEach(async () => {
    // Delete tables after each test
    await clear();
  });

  afterAll(async () => {
    await module.close()
  })

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
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);
    const user_1 = new User()
    user_1.id = 'user id 1';
    user_1.username = 'test id';
    user_1.password = 'testPWD';
    user_1.mobileNumber = '010-8098-1398';
    user_1.name = 'test name';
    user_1.createId ='user id';

    await userRepository.save(user_1)

    await attendanceRepository
    const attendance_1 = new Attendance()
    attendance_1.id = 'testAttendanceId';
    attendance_1.title = 'testAttendanceTitle';
    attendance_1.description = 'description';
    attendance_1.type = AttendanceType.WEEKDAY;
    attendance_1.createId = 'user id 1';
    attendance_1.createdAt = new Date();

    const attendance_2 = new Attendance()
    attendance_2.id = 'notTestAttendanceId';
    attendance_2.title = 'testAttendanceTitle2';
    attendance_2.description = 'description';
    attendance_2.type = AttendanceType.WEEKDAY;
    attendance_2.createId = 'user id 1';
    attendance_2.createdAt = new Date();

    await attendanceRepository.save(attendance_1)
    await attendanceRepository.save(attendance_2)


    // await attendanceRepository.query(
    //     `INSERT INTO attendance SET
    //     id = 'testAttendanceId',
    //     title = 'testAttendanceTitle',
    //     description = 'description',
    //     type = 'weekday',
    //     createId = 'user id 1',
    //     createdAt = NOW();`,
    // );
    // await attendanceRepository.query(
    //     `INSERT INTO attendance SET
    //     id = 'notTestAttendanceId',
    //     title = 'testAttendanceTitle2',
    //     description = 'description',
    //     type = 'weekday',
    //     createId = 'user id 1',
    //     createdAt = NOW();`,
    // );
  }

  async function clear() {
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance');
    await userRepository.query(`DELETE FROM user;`);
  }
});
