import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsService } from '../../../src/invitations/invitations.service';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { User } from '../../../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Invitation } from '../../../src/invitations/entities/invitation.entity';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';

describe('InvitationsService', () => {
  let module: TestingModule;
  let service: InvitationsService;
  let invitationRepository: Repository<Invitation>;
  let attendanceRepository: Repository<Attendance>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Invitation])],
      providers: [InvitationsService],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
    invitationRepository = module.get(getRepositoryToken(Invitation));
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

  async function setupTest() {
    await invitationRepository.query('DELETE FROM invitation;');
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

    await attendanceRepository.save([attendance_1, attendance_2]);
  }

  async function clear() {
    await invitationRepository.query('DELETE FROM invitation;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);
  }
});
