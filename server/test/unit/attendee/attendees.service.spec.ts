import { Test, TestingModule } from '@nestjs/testing';
import { AttendeesService } from '../../../src/attendees/attendees.service';
import { TestModule } from '../../../src/test.module';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { User } from '../../../src/users/entities/user.entity';
import { CreateAttendeeDto } from '../../../src/attendees/dto/create-attendee.dto';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';
import { DataSource, In, Repository } from 'typeorm';
import * as module from 'module';
import { UpdateAttendeeDto } from '../../../src/attendees/dto/update-attendee.dto';
import { DeleteAttendeeDto } from '../../../src/attendees/dto/delete-attendee.dto';
import { createAttendee } from './createAttendee';

describe('AttendeesService', () => {
  let module: TestingModule;
  let service: AttendeesService;
  let attendeeRepository: Repository<Attendee>;
  let attendanceRepository: Repository<Attendance>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Attendee, User])],
      providers: [AttendeesService],
    }).compile();

    service = module.get<AttendeesService>(AttendeesService);
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

  describe('createAttendee Test ', () => {
    it('Attendee를 생성 성공시에 success,message,id를 리턴한다.', async () => {
      // given
      const attendeeDto = createAttendeeDto('test name', 'testAttendanceId', 'this is first attendee', 15);

      const user = new User();
      user.id = 'user id 1';

      // when
      const sut = await service.createAttendee(attendeeDto, user);

      // then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS CREATE ATTENDEE');
    });

    it('Attendee 테이블에 Attendee를 생성한다.', async () => {
      // given
      const attendeeDto = createAttendeeDto('test name', 'testAttendanceId', 'this is first attendee', 15);

      const user = new User();
      user.id = 'user id 1';

      // when
      const createResponse = await service.createAttendee(attendeeDto, user);

      const sut = await attendeeRepository.findOneBy({ id: createResponse.data.id });

      // then
      expect(sut?.name).toBe('test name');
      expect(sut?.description).toBe('this is first attendee');
      expect(sut?.createId).toBe('user id 1');
      expect(sut?.attendanceId).toBe('testAttendanceId');
    });

    it('createAttendeeDto의 정보로 Attendee를 생성한다.', async () => {
      // given
      const attendeeDto = new CreateAttendeeDto();
      attendeeDto.name = 'test name';
      attendeeDto.attendanceId = 'testAttendanceId';
      attendeeDto.description = 'this is first attendee';
      attendeeDto.age = 15;
      attendeeDto.mobileNumber = '01080981398';
      attendeeDto.subMobileNumber = '01026478104';

      const user = new User();
      user.id = 'user id 1';

      // when
      const createResponse = await service.createAttendee(attendeeDto, user);

      const sut = await attendeeRepository.findOneBy({ id: createResponse.data.id });

      // then
      expect(sut?.name).toBe('test name');
      expect(sut?.description).toBe('this is first attendee');
      expect(sut?.createId).toBe('user id 1');
      expect(sut?.attendanceId).toBe('testAttendanceId');
      expect(sut?.mobileNumber).toBe('01080981398');
      expect(sut?.subMobileNumber).toBe('01026478104');
    });
  });

  describe('findAllByAttendanceId Test', () => {
    it('출석부에 해당된 모든 출석 대상을 조사한다.', async () => {
      // given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendeeDto_1 = createAttendeeDto('가나다', 'testAttendanceId', '가나다 학생', 3);
      const attendeeDto_2 = createAttendeeDto('라마바', 'testAttendanceId', '라마바 학생', 4);
      const attendeeDto_3 = createAttendeeDto('아자차', 'notTestAttendanceId', '아자차 학생', 5);

      await service.createAttendee(attendeeDto_1, user_1);
      await service.createAttendee(attendeeDto_2, user_1);
      await service.createAttendee(attendeeDto_3, user_1);

      // when
      const sut = await service.findAllByAttendanceId(attendance.id);

      // then
      expect(sut.count).toBe(2);
      sut.items.forEach((data) => {
        expect(data.attendanceId).toBe('testAttendanceId');
      });
    });
  });

  describe('update TEST', () => {
    it('update attendee 성공 시 success,message,id를 리턴한다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendee = createAttendee('가나다', 'testAttendanceId', '가나다 학생', 3, user_1.id);

      const createdAttendee = await attendeeRepository.save(attendee);

      // When
      const now = new Date();

      const updateDto = new UpdateAttendeeDto();
      updateDto.name = '수정된';
      updateDto.description = '수정되었습니다';
      updateDto.age = 99;

      const sut = await service.update(createdAttendee.id, updateDto);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS UPDATE ATTENDEE');
      expect(sut.data.id).toBeDefined();
    });

    it('이름, 설명, 나이 중 원하는 값을 수정할 수 있다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendee = createAttendee('가나다', 'testAttendanceId', '가나다 학생', 3, user_1.id);

      const createdAttendee = await attendeeRepository.save(attendee);

      const now = new Date();

      const updateDto = new UpdateAttendeeDto();
      updateDto.name = '수정된';
      updateDto.description = '수정되었습니다';
      updateDto.age = 99;

      // When
      const updatedAttendee = await service.update(createdAttendee.id, updateDto);

      const sut = await attendeeRepository.findOneBy({ id: updatedAttendee.data.id });

      // Then
      expect(sut.name).toBe('수정된');
      expect(sut.description).toBe('수정되었습니다');
      expect(sut.age).toBe(99);
    });

    it('수정한 회원의 Id 와 수정 시간이 기록된다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendee = createAttendee('가나다', 'testAttendanceId', '가나다 학생', 3, user_1.id);

      const createdAttendee = await attendeeRepository.save(attendee);

      const now = new Date();

      const updateDto = new UpdateAttendeeDto();
      updateDto.updateId = user_1.id;
      updateDto.updatedAt = now;

      // When
      const updatedAttendee = await service.update(createdAttendee.id, updateDto);

      const sut = await attendeeRepository.findOneBy({ id: updatedAttendee.data.id });

      // Then
      expect(sut.name).toBe('가나다');
      expect(sut.description).toBe('가나다 학생');
      expect(sut.age).toBe(3);
      expect(sut.updateId).toBe('user id 1');
      expect(sut.updatedAt).toStrictEqual(now);
    });
  });

  describe('findOneById TEST', () => {
    it('수정한 회원의 Id 와 수정 시간이 기록된다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const now = new Date();

      const attendee = createAttendee('가나다', 'testAttendanceId', '가나다 학생', 3, user_1.id);
      attendee.createdAt = now;

      const createdAttendee = await attendeeRepository.save(attendee);

      // When
      const sut = await service.findOneById(createdAttendee.id);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS FIND ATTENDEE');
    });

    it('수정한 회원의 Id 와 수정 시간이 기록된다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const now = new Date();

      const attendee = createAttendee('가나다', 'testAttendanceId', '가나다 학생', 3, user_1.id);
      attendee.createdAt = now;

      const createdAttendee = await attendeeRepository.save(attendee);

      // When
      const sut = await service.findOneById(createdAttendee.id);

      // Then
      expect(sut.data.name).toBe('가나다');
      expect(sut.data.attendanceId).toBe('testAttendanceId');
      expect(sut.data.description).toBe('가나다 학생');
      expect(sut.data.age).toBe(3);
      expect(sut.data.createId).toBe(user_1.id);
      expect(sut.data.createdAt).toStrictEqual(now);
    });
  });

  describe('delete TEST', () => {
    it('배열에 입력한 모든 출석대상을 soft delete 한다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendee_1 = createAttendee('가나다', 'testAttendanceId', '가나다 학생', 3, user_1.id);

      const attendee_2 = createAttendee('라마바', 'testAttendanceId', '라마바 학생', 5, user_1.id);

      const createdAttendee_1 = await attendeeRepository.save(attendee_1);
      const createdAttendee_2 = await attendeeRepository.save(attendee_2);

      // When
      const deleteDto = new DeleteAttendeeDto();
      deleteDto.ids = [createdAttendee_1.id, createdAttendee_2.id];
      deleteDto.attendanceId = 'testAttendanceId';

      await service.deleteAll(deleteDto);

      const sut = await attendeeRepository.findBy({
        id: In(deleteDto.ids),
      });

      // Then
      expect(sut).toHaveLength(0);
    });

    it('AttendanceId에 속하지 않은 Attendee를 삭제할 경우 에러를 발생시킨다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const now = new Date();

      const attendee_1 = createAttendee('가나다', 'testAttendanceId', '가나다 학생', 3, user_1.id);

      const attendee_2 = createAttendee('라마바', 'testAttendanceId', '라마바 학생', 5, user_1.id);

      const attendee_3 = createAttendee('아자차', 'notTestAttendanceId', '아자차 학생', 7, user_1.id);

      const createdAttendee_1 = await attendeeRepository.save(attendee_1);
      const createdAttendee_2 = await attendeeRepository.save(attendee_2);
      const createdAttendee_3 = await attendeeRepository.save(attendee_3);

      // When
      const deleteDto = new DeleteAttendeeDto();
      deleteDto.ids = [createdAttendee_1.id, createdAttendee_2.id, createdAttendee_3.id];
      deleteDto.attendanceId = 'testAttendanceId';

      // Then
      expect(async () => await service.deleteAll(deleteDto)).rejects.toThrowError();
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

    await attendanceRepository;
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
  }

  async function clear() {
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance');
    await userRepository.query(`DELETE FROM user;`);
  }
});
function createAttendeeDto(name, attendanceId, description, age) {
  const createAttendeeDto = new CreateAttendeeDto();
  createAttendeeDto.name = name;
  createAttendeeDto.attendanceId = attendanceId;
  createAttendeeDto.description = description;
  createAttendeeDto.age = age;
  return createAttendeeDto;
}
