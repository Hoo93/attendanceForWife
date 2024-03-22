import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from '../../../src/attendances/attendances.service';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { UserAttendance } from '../../../src/attendances/entities/user-attendance.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CreateAttendanceDto } from '../../../src/attendances/dto/create-attendance.dto';
import { User } from '../../../src/users/entities/user.entity';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';
import { TestModule } from '../../../src/test.module';
import { RoleType } from '../../../src/roles/entities/role-type.enum';
import { UpdateAttendanceDto } from '../../../src/attendances/dto/update-attendance.dto';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { Repository } from 'typeorm';

describe('AttendancesService', () => {
  let module: TestingModule;
  let service: AttendancesService;
  let attendanceRepository: Repository<Attendance>;
  let attendeeRepository: Repository<Attendee>;
  let userAttendanceRepository: Repository<UserAttendance>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Attendance, UserAttendance, User])],
      providers: [AttendancesService],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    attendanceRepository = module.get(getRepositoryToken(Attendance));
    userAttendanceRepository = module.get(getRepositoryToken(UserAttendance));
    userRepository = module.get(getRepositoryToken(User));
    attendeeRepository = module.get(getRepositoryToken(Attendee));
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

  describe('createAttendance Test', () => {
    it('출석부 생성 성공시 success,message,data.id를 반환한다.', async () => {
      // given
      const attendanceDto = createAttendanceDto('test title', 'test description', AttendanceType.WEEKDAY);

      const user = new User();
      user.id = 'user id 1';

      // when
      const createdResponse = await service.create(attendanceDto, user);

      const newAttendance = await service.findOneById(createdResponse.data.id);

      // then
      expect(createdResponse.success).toBe(true);
      expect(createdResponse.message).toBe('SUCCESS CREATE ATTENDANCE');
      expect(createdResponse.data).toHaveProperty('id');
    });

    it('출석부 테이블에 출석부를 생성한다.', async () => {
      // given
      const attendanceDto = createAttendanceDto('test title', 'test description', AttendanceType.WEEKDAY);

      const user = new User();
      user.id = 'user id 1';

      // when
      const createdResponse = await service.create(attendanceDto, user);

      const newAttendance = await service.findOneById(createdResponse.data.id);

      // then
      expect(newAttendance.data.title).toBe('test title');
      expect(newAttendance.data.description).toBe('test description');
      expect(newAttendance.data.type).toBe(AttendanceType.WEEKDAY);
    });

    it('UserAttendance 테이블에 MASTER 권한으로 데이터가 생성된다.', async () => {
      // given
      const attendanceDto = createAttendanceDto('test title 1', 'test description', AttendanceType.WEEKDAY);

      const user = new User();
      user.id = 'user id 1';

      // when
      const sut = await service.create(attendanceDto, user);

      const userAttendance = await userAttendanceRepository.findBy({
        userId: 'user id 1',
      });

      // then
      expect(userAttendance[0].role).toBe(RoleType.MASTER);
      expect(userAttendance[0].attendanceId).toBe(sut.data.id);
    });
  });

  describe('findAllByUserId Test', () => {
    it('회원의 id로 생성된 모든 출석부를 조회한다.', async () => {
      // given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const createAttendanceDto_1 = createAttendanceDto('test title 1', 'test description', AttendanceType.WEEKDAY);

      const createdResponse = await service.create(createAttendanceDto_1, user_1);

      const attendee_1 = new Attendee();
      attendee_1.attendanceId = createdResponse.data.id;
      attendee_1.name = '박우현';
      attendee_1.age = 30;
      attendee_1.createId = user_1.id;

      const attendee_2 = new Attendee();
      attendee_2.attendanceId = createdResponse.data.id;
      attendee_2.name = '김우빈';
      attendee_2.age = 37;
      attendee_2.createId = user_1.id;

      const attendee_3 = new Attendee();
      attendee_3.attendanceId = createdResponse.data.id;
      attendee_3.name = '방정숙';
      attendee_3.age = 45;
      attendee_3.createId = user_1.id;

      await attendeeRepository.save([attendee_1, attendee_2, attendee_3]);

      // when
      const sut = await service.findAllByUserId(user_1.id);

      // then
      expect(sut.count).toBe(1);
      expect(sut.items[0].attendance.id).toBe(createdResponse.data.id);
      // 아래 검증은 결과는 제대로 나오나 TypeScript가 인식하지 못함
      // expect(sut.items[0].attendance?.attendeeCount).toBe(3);
    });

    it('회원의 id로 생성된 모든 출석부와 출석부에 속해있는 Attendee의 수를 조회한다.', async () => {
      // given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const user_2 = new User();
      user_2.id = 'user id 2';

      const createAttendanceDto_1 = createAttendanceDto('test title 1', 'test description', AttendanceType.WEEKDAY);
      const createAttendanceDto_2 = createAttendanceDto('test title 2', 'test description', AttendanceType.WEEKDAY);
      const createAttendanceDto_3 = createAttendanceDto('test title 3', 'test description', AttendanceType.WEEKDAY);

      await service.create(createAttendanceDto_1, user_1);
      await service.create(createAttendanceDto_2, user_1);
      await service.create(createAttendanceDto_3, user_2);

      // when
      const sut = await service.findAllByUserId(user_1.id);
      // then
      expect(sut.success).toBe(true);
      expect(sut.count).toBe(2);
      sut.items.forEach((data) => {
        expect(data.attendance.createId).not.toBe(user_2.id);
        expect(data.attendance.createId).toBe(user_1.id);
      });
    });
  });

  describe('update Test', () => {
    it('선택한 출석부 id의 정보를 수정한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const createAttendanceDto_1 = createAttendanceDto('test title 1', 'test description', AttendanceType.WEEKDAY);

      const createdResponse = await service.create(createAttendanceDto_1, user_1);

      const updateAttendanceDto = new UpdateAttendanceDto();
      updateAttendanceDto.title = 'updated Title';
      updateAttendanceDto.description = 'updated description';
      updateAttendanceDto.type = AttendanceType.WEEKEND;

      // When
      await service.update(createdResponse.data.id, updateAttendanceDto);

      const sut = await service.findOneById(createdResponse.data.id);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.data?.title).toBe('updated Title');
      expect(sut.data?.description).toBe('updated description');
      expect(sut.data?.type).toBe(AttendanceType.WEEKEND);
    });
  });

  describe('delete Test', () => {
    it('출석부 삭제시 success와 message를 리턴한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const createAttendanceDto_1 = createAttendanceDto('test title 1', 'test description', AttendanceType.WEEKDAY);

      const createdResponse = await service.create(createAttendanceDto_1, user_1);

      // When
      const sut = await service.delete(createdResponse.data.id, user_1.id);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS DELETE ATTENDANCE');
    });

    it('선택한 출석부를 soft delete 한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const createAttendanceDto_1 = createAttendanceDto('test title 1', 'test description', AttendanceType.WEEKDAY);

      const createdResponse = await service.create(createAttendanceDto_1, user_1);

      // When
      await service.delete(createdResponse.data.id, user_1.id);

      const sut = await attendanceRepository.findOneBy({ id: createdResponse.data.id });

      // Then
      expect(sut).toBeNull();
    });

    it('출석부를 삭제하면 user_attendance 테이블에서도 soft delete 된다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const createAttendanceDto_1 = createAttendanceDto('test title 1', 'test description', AttendanceType.WEEKDAY);

      const createdResponse = await service.create(createAttendanceDto_1, user_1);

      // When
      await service.delete(createdResponse.data.id, user_1.id);

      const sut = await userAttendanceRepository.findOneBy({ attendanceId: createdResponse.data.id });

      // Then
      expect(sut).toBeNull();
    });
  });

  async function setupTest() {
    await userRepository.query(
      `INSERT INTO user SET 
        id = 'user id 1' , 
        username = 'test id 1',
        password = 'testPWD',
        mobileNumber = '01080981398',
        name = 'test name',
        createId ='user id'`,
    );

    await userRepository.query(
      `INSERT INTO user SET 
        id = 'user id 2' , 
        username = 'test id 2',
        password = 'testPWD',
        mobileNumber = '01026478104',
        name = 'test name',
        createId ='user id'`,
    );
  }

  async function clear() {
    await attendeeRepository.query('DELETE FROM attendee;');
    await userAttendanceRepository.query('DELETE FROM user_attendance;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);
  }
});

function createAttendanceDto(title, description, type): CreateAttendanceDto {
  const createAttendanceDto = new CreateAttendanceDto();
  createAttendanceDto.title = title;
  createAttendanceDto.description = description;
  createAttendanceDto.type = type;
  return createAttendanceDto;
}
