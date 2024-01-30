// @ts-ignore

import { Test, TestingModule } from '@nestjs/testing';
import { RecordsService } from '../../../src/records/records.service';
import { User } from '../../../src/users/entities/user.entity';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../../../src/records/entities/record.entity';
import { CreateRecordDto } from '../../../src/records/dto/create-record.dto';
import { DayType } from '../../../src/schedules/const/day-type.enum';
import { AttendanceStatus } from '../../../src/records/record-type.enum';
import { In, Repository } from 'typeorm';
import { DeleteRecordDto } from '../../../src/records/dto/delete-record.dto';
import { createSimpleAttendee } from '../attendee/createSimpleAttendee';
import { CreateAllRecordDto } from '../../../src/records/dto/createAll-record.dto';

describe('RecordsService', () => {
  let module: TestingModule;
  let service: RecordsService;
  let recordRepository: Repository<Record>;
  let attendeeRepository;
  let attendanceRepository;
  let userRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Record])],
      providers: [RecordsService],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
    recordRepository = module.get(getRepositoryToken(Record));
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

      const recordDto = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, attendee.id);

      const sut = await service.create(recordDto, user);

      expect(sut.attendeeId).toBe('Attendee Id 1');
      expect(sut.date).toBe('2024-01-15');
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

      const recordDto = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, attendee.id);
      recordDto.createdAt = now;

      const sut = await service.create(recordDto, user);

      expect(sut.createdAt).toStrictEqual(now);
      expect(sut.createId).toBe('user id 1');
    });

    it('선택한 날짜에 선택한 출석대상의 출석내용이 이미 존재하는 경우 Update 한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const recordDto_1 = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, attendee.id);

      await service.create(recordDto_1, user);

      const recordDto_2 = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.ABSENT, attendee.id);

      // When
      const sut = await service.create(recordDto_2, user);

      // Then
      expect(sut.attendeeId).toBe('Attendee Id 1');
      expect(sut.date).toBe('2024-01-15');
      expect(sut.day).toBe('MONDAY');
      expect(sut.status).not.toBe('Present');
      expect(sut.status).toBe('Absent');
    });
  });

  describe('CreateAll Test', () => {
    it('선택한 날짜와 선택한 출석부의 모든 출석기록을 일괄 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', attendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', attendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', attendanceId, 'user id 1');

      await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const createAllRecordDto = new CreateAllRecordDto();
      createAllRecordDto.day = DayType.TUESDAY;
      createAllRecordDto.date = new Date('2024-01-30');
      createAllRecordDto.status = AttendanceStatus.PRESENT;
      createAllRecordDto.attendanceId = attendanceId;

      // When
      await service.createAll(createAllRecordDto, user);

      const sut = await recordRepository.find({
        where: {
          date: createAllRecordDto.date,
          attendee: {
            attendanceId: createAllRecordDto.attendanceId,
          },
        },
      });

      // Then
      expect(sut).toHaveLength(2);
      sut.map((record) => {
        expect(record.status).toBe(AttendanceStatus.PRESENT);
        expect(record.date).toBe(new Date('2024-01-30'));
        expect(record.day).toBe(DayType.TUESDAY);
        expect(record.createId).toBe(user.id);
      });
    });
  });

  describe('deleteAll TEST', () => {
    it('배열에 입력한 모든 출석기록을 soft delete 한다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = attendance.id;

      const record_1 = createRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.ABSENT, attendee_1.id, user_1.id);
      const record_2 = createRecord('2024-01-16', DayType.MONDAY, AttendanceStatus.ABSENT, attendee_1.id, user_1.id);

      const createdRecord_1 = await recordRepository.save(record_1);
      const createdRecord_2 = await recordRepository.save(record_2);

      const deleteDto = new DeleteRecordDto();
      deleteDto.ids = [createdRecord_1.id, createdRecord_2.id];
      deleteDto.attendanceId = 'testAttendanceId';

      // When
      await service.deleteAll(deleteDto);

      const sut = await recordRepository.findBy({
        id: In(deleteDto.ids),
      });

      // Then
      expect(sut).toHaveLength(0);
    });

    it('Attendance에 속하지 않은 Record를 삭제하면 에러를 발생시킨다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = targetAttendanceId;

      const attendee_2 = new Attendee();
      attendee_2.id = 'Attendee Id 2';
      attendee_2.attendanceId = 'notTestAttendanceId';

      const record_1 = createRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.ABSENT, attendee_1.id, user_1.id);
      const record_2 = createRecord('2024-01-16', DayType.MONDAY, AttendanceStatus.ABSENT, attendee_2.id, user_1.id);

      const createdRecord_1 = await recordRepository.save(record_1);
      const createdRecord_2 = await recordRepository.save(record_2);

      const deleteDto = new DeleteRecordDto();
      deleteDto.ids = [createdRecord_1.id, createdRecord_2.id];
      deleteDto.attendanceId = targetAttendanceId;

      // When / Then
      expect(async () => {
        await service.deleteAll(deleteDto);
      }).rejects.toThrowError();
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
function createRecordDto(date, day: DayType, status: AttendanceStatus, attendeeId) {
  const recordDto = new CreateRecordDto();
  recordDto.date = date;
  recordDto.day = day;
  recordDto.status = status;
  recordDto.attendeeId = attendeeId;
  return recordDto;
}

function createRecord(date, day: DayType, status: AttendanceStatus, attendeeId, userId) {
  const record = new Record();
  record.date = date;
  record.day = day;
  record.status = status;
  record.attendeeId = attendeeId;
  record.createId = userId;
  return record;
}
