import { Test, TestingModule } from '@nestjs/testing';
import { RecordsService } from '../../../src/records/records.service';
import { User } from '../../../src/users/entities/user.entity';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../../../src/schedules/entities/schedule.entity';
import { Record } from '../../../src/records/entities/record.entity';
import { CreateRecordDto } from '../../../src/records/dto/create-record.dto';
import { DayType } from '../../../src/schedules/const/day-type.enum';
import { AttendanceStatus } from '../../../src/records/record-type.enum';

describe('RecordsService', () => {
  let module: TestingModule;
  let service: RecordsService;
  let recordRepository;
  let attendeeRepository;
  let attendanceRepository;
  let userRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Record])],
      providers: [RecordsService],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
    recordRepository = module.get(getRepositoryToken(Schedule));
    attendeeRepository = module.get(getRepositoryToken(Attendee));
    attendanceRepository = module.get(getRepositoryToken(Attendance));
    userRepository = module.get(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await setupTest();
  });

  afterEach(async () => {
    // Delete tables after each test
    await clear();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Record Test', () => {
    it('입력한 값으로 출석기록을 생성한다.', async () => {
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const recordDto = createRecordDto(
        '2024-01-15 12:30:00',
        DayType.MONDAY,
        AttendanceStatus.PRESENT,
        attendee.id,
      );

      const sut = await service.create(recordDto, user);

      expect(sut.attendeeId).toBe('Attendee Id 1');
      expect(sut.datetime).toBe('2024-01-15 12:30:00');
      expect(sut.day).toBe('MONDAY');
      expect(sut.status).toBe('Present');
    });

    it('출석부 생성 시 createId, createdAt을 기록한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const now = new Date();

      const recordDto = createRecordDto(
        '2024-01-15 12:30:00',
        DayType.MONDAY,
        AttendanceStatus.PRESENT,
        attendee.id,
      );
      recordDto.createdAt = now;

      const sut = await service.create(recordDto, user);

      expect(sut.createdAt).toStrictEqual(now);
      expect(sut.createId).toBe('user id 1');
    });
  });

  async function setupTest() {
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);

    const user_1 = new User();
    user_1.id = 'user id 1';
    user_1.username = 'test id';
    user_1.password = 'testPWD';
    user_1.mobileNumber = '010-8098-1398';
    user_1.name = 'test name';
    user_1.createId = 'user id';

    await userRepository.save(user_1);

    const attendance_1 = new Attendance();
    attendance_1.id = 'testAttendanceId';
    attendance_1.title = 'testAttendanceTitle';
    attendance_1.description = 'description';
    attendance_1.type = AttendanceType.WEEKDAY;
    attendance_1.createId = 'user id 1';
    attendance_1.createdAt = new Date();

    const attendance_2 = new Attendance();
    attendance_2.id = 'notTestAttendanceId';
    attendance_2.title = 'testAttendanceTitle2';
    attendance_2.description = 'description';
    attendance_2.type = AttendanceType.WEEKDAY;
    attendance_2.createId = 'user id 1';
    attendance_2.createdAt = new Date();

    await attendanceRepository.save(attendance_1);
    await attendanceRepository.save(attendance_2);

    const attendee_1 = new Attendee();
    attendee_1.id = 'Attendee Id 1';
    attendee_1.name = 'Attendee Name 1';
    attendee_1.attendanceId = attendance_1.id;
    attendee_1.description = 'Attendee 1 description';
    attendee_1.age = 10;
    attendee_1.createId = user_1.id;

    const attendee_2 = new Attendee();
    attendee_2.id = 'Attendee Id 2';
    attendee_2.name = 'Attendee Name 2';
    attendee_2.attendanceId = attendance_2.id;
    attendee_2.description = 'Attendee 2 description';
    attendee_2.age = 20;
    attendee_2.createId = user_1.id;

    await attendeeRepository.save(attendee_1);
    await attendeeRepository.save(attendee_2);
  }

  async function clear() {
    await recordRepository.query('DELETE FROM record;');
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);
  }
});

function createRecordDto(
  datetime,
  day: DayType,
  status: AttendanceStatus,
  attendeeId,
) {
  const recordDto = new CreateRecordDto();
  recordDto.datetime = datetime;
  recordDto.day = day;
  recordDto.status = status;
  recordDto.attendeeId = attendeeId;
  return recordDto;
}