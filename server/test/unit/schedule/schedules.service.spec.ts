import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from '../../../src/schedules/schedules.service';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { User } from '../../../src/users/entities/user.entity';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { Schedule } from '../../../src/schedules/entities/schedule.entity';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';
import { DayType } from '../../../src/schedules/const/day-type.enum';
import { CreateScheduleDto } from '../../../src/schedules/dto/create-schedule.dto';
import { BadRequestException } from '@nestjs/common';
import { DeleteAttendeeDto } from '../../../src/attendees/dto/delete-attendee.dto';
import { In } from 'typeorm';
import { DeleteScheduleDto } from '../../../src/schedules/dto/delete-schedule.dto';

describe('SchedulesService', () => {
  let module: TestingModule;
  let service: SchedulesService;
  let scheduleRepository;
  let attendeeRepository;
  let attendanceRepository;
  let userRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Schedule])],
      providers: [SchedulesService],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
    scheduleRepository = module.get(getRepositoryToken(Schedule));
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

  describe('Create Schedules Test', () => {
    it('선택한 요일과 시간으로 출석 대상의 스케쥴을 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const scheduleDto = generateCreateScheduleDto('Attendee Id 1', DayType.MONDAY, '1000');

      // When
      const sut = await service.create(scheduleDto, user);

      // Then
      expect(sut.attendeeId).toBe('Attendee Id 1');
      expect(sut.day).toBe('MONDAY');
      expect(sut.time).toBe('1000');
    });

    it('입력한 시간이 0000~2400 범위에 있지 않으면 오류를 일으킨다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const scheduleDto = generateCreateScheduleDto('Attendee Id 1', DayType.MONDAY, '4500');

      // Then
      await expect(async () => {
        await service.create(scheduleDto, user);
      }).rejects.toThrowError(new BadRequestException('유효하지 않은 시간 포맷입니다.'));
    });
  });

  describe('findByAttendeeId Test.', () => {
    it('출석 대상의 모든 스케쥴을 조사한다.', async () => {
      // Given
      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
      const schedule_2 = createSchedule('Attendee Id 1', DayType.TUESDAY, '1330');

      const schedule_3 = createSchedule('Attendee Id 2', DayType.TUESDAY, '1330');

      await scheduleRepository.insert(schedule_1);
      await scheduleRepository.insert(schedule_2);
      await scheduleRepository.insert(schedule_3);

      // When
      const sut = await service.findByAttendeeId(attendee_1.id);

      // Then
      expect(sut).toHaveLength(2);
      sut.map((result) => {
        expect(result.attendeeId).toBe('Attendee Id 1');
      });
    });

    it('스케쥴이 없는 경우 빈 배열을 리턴한다.', async () => {
      // Given
      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';

      // When
      const sut = await service.findByAttendeeId(attendee_1.id);

      // Then
      expect(sut).toHaveLength(0);
      expect(sut).toBeInstanceOf(Array);
    });
  });

  describe('findByAttendanceId Test', () => {
    it('출석부에 스케쥴과 조회 날짜의 record를 리턴한다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = targetAttendanceId;

      const attendee_2 = new Attendee();
      attendee_2.id = 'Attendee Id 2';
      attendee_2.attendanceId = 'notTestAttendanceId';

      const attendee_3 = new Attendee();
      attendee_3.id = 'Attendee Id 3';
      attendee_3.attendanceId = targetAttendanceId;

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
      const schedule_2 = createSchedule('Attendee Id 2', DayType.TUESDAY, '1330');

      const schedule_3 = createSchedule('Attendee Id 3', DayType.WEDNESDAY, '1430');
      await scheduleRepository.insert([schedule_1, schedule_2, schedule_3]);

      // When
      const sut = await service.findByAttendanceId(targetAttendanceId);

      // Then
      expect(sut).toHaveLength(2);
      sut.map((schedule) => {
        expect(schedule.attendee.attendanceId).toBe(targetAttendanceId);
        expect(schedule.record).toBeDefined();
      });
    });

    it('출석부에 속한 모든 출석대상의 스케쥴을 리턴한다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = targetAttendanceId;

      const attendee_2 = new Attendee();
      attendee_2.id = 'Attendee Id 2';
      attendee_2.attendanceId = 'notTestAttendanceId';

      const attendee_3 = new Attendee();
      attendee_3.id = 'Attendee Id 3';
      attendee_3.attendanceId = targetAttendanceId;

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
      const schedule_2 = createSchedule('Attendee Id 2', DayType.TUESDAY, '1330');

      const schedule_3 = createSchedule('Attendee Id 3', DayType.WEDNESDAY, '1430');
      await scheduleRepository.insert([schedule_1, schedule_2, schedule_3]);

      // When
      const sut = await service.findByAttendanceId(targetAttendanceId);

      // Then
      expect(sut).toHaveLength(2);
      sut.map((schedule) => {
        expect(schedule.attendee.attendanceId).toBe(targetAttendanceId);
      });
    });

    describe('deleteAll TEST', () => {
      it('배열에 입력한 모든 스케쥴을 soft delete 한다.', async () => {
        // Given
        const attendee_1 = new Attendee();
        attendee_1.id = 'Attendee Id 1';

        const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
        const schedule_2 = createSchedule('Attendee Id 1', DayType.TUESDAY, '1330');

        const createdAttendee_1 = await attendeeRepository.save(attendee_1);

        const createdSchedule_1 = await scheduleRepository.save(schedule_1);
        const createdSchedule_2 = await scheduleRepository.save(schedule_2);

        // When
        const deleteDto = new DeleteScheduleDto();
        deleteDto.ids = [schedule_2.id, schedule_2.id];

        await service.deleteAll(deleteDto);

        const sut = await attendeeRepository.findBy({
          id: In(deleteDto.ids),
        });

        // Then
        expect(sut).toHaveLength(0);
      });
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

    const attendee_3 = new Attendee();
    attendee_3.id = 'Attendee Id 3';
    attendee_3.name = 'Attendee Name 2';
    attendee_3.attendanceId = attendance_1.id;
    attendee_3.description = 'Attendee 2 description';
    attendee_3.age = 20;
    attendee_3.createId = user_1.id;

    // await attendeeRepository.save
    await attendeeRepository.save([attendee_1, attendee_2, attendee_3]);
  }

  async function clear() {
    await scheduleRepository.query('DELETE FROM schedule;');
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);
  }
});

function generateCreateScheduleDto(attendeeId: string, day: DayType, time: string) {
  const createScheduleDto = new CreateScheduleDto();
  createScheduleDto.attendeeId = attendeeId;
  createScheduleDto.day = day;
  createScheduleDto.time = time;
  return createScheduleDto;
}

function createSchedule(attendeeId: string, day: DayType, time: string) {
  const schedule = new Schedule();
  schedule.attendeeId = attendeeId;
  schedule.day = day;
  schedule.time = time;
  schedule.createId = 'user id 1';
  return schedule;
}
