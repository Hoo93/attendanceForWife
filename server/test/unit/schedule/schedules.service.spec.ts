import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from '../../../src/schedules/schedules.service';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { User } from '../../../src/users/entities/user.entity';
import { AttendeesService } from '../../../src/attendees/attendees.service';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { Schedule } from '../../../src/schedules/entities/schedule.entity';

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
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Schedule, Attendee])],
      providers: [SchedulesService],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  async function clear() {
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance');
    await userRepository.query(`DELETE FROM user;`);
  }
});
