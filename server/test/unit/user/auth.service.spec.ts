import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../../../src/auth/dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { MockJwtService } from './mockJwtService';
import { Repository } from 'typeorm';
import { TestModule } from '../../../src/test.module';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../src/users/entities/user.entity';
import { LoginHistory } from '../../../src/auth/entity/login-history.entity';
import { AuthService } from '../../../src/auth/auth.service';
import { CreateAuthDto } from '../../../src/auth/dto/create-auth.dto';
import { UserType } from '../../../src/users/const/user-type.enum';
import { JwtPayload } from '../../../src/auth/const/jwtPayload.interface';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { UserAttendance } from '../../../src/attendances/entities/user-attendance.entity';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';
import { RoleType } from '../../../src/roles/entities/role-type.enum';

describe('UserAuthService Test', function () {
  let module: TestingModule;
  let service: AuthService;
  let userRepository: Repository<User>;
  let userAttendanceRepository: Repository<UserAttendance>;
  let attendanceRepository: Repository<Attendance>;
  let loginHistoryRepository: Repository<LoginHistory>;
  let jwtService: MockJwtService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([User, LoginHistory, UserAttendance, Attendance])],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    attendanceRepository = module.get(getRepositoryToken(Attendance));
    userAttendanceRepository = module.get(getRepositoryToken(UserAttendance));
    loginHistoryRepository = module.get(getRepositoryToken(LoginHistory));
    jwtService = module.get<MockJwtService>(JwtService);
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

  it('authService should be defined', function () {
    expect(service).toBeDefined();
    expect(service.signup).toBeDefined();
  });

  it('signup return User without password', async () => {
    const dto = new CreateAuthDto();
    dto.username = 'testID';
    dto.password = 'testpwd123!';
    dto.name = 'testname';
    dto.mobileNumber = '010-8098-1398';
    dto.birthday = '1117';
    dto.birthYear = 1993;
    dto.email = 'sksk8922@gmail.com';

    const signupResult = await service.signup(dto);
    expect(signupResult.success).toBeTruthy();
    expect(signupResult.message).toBe('SUCCESS SIGNUP');

    expect(signupResult.data.username).toBe('testID');
    expect(signupResult.data.name).toBe('testname');
    expect(signupResult.data.mobileNumber).toBe('010-8098-1398');
    expect(signupResult.data.birthday).toBe('1117');
    expect(signupResult.data.birthYear).toBe(1993);
    expect(signupResult.data.email).toBe('sksk8922@gmail.com');
    expect(signupResult.data.password).not.toBeDefined();
  });

  describe('signIn method test', () => {
    it('should return access-token and refresh-token', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const testUser = createSimpleUser('박상후', 'TestUser1');

      await userRepository.insert(testUser);

      const signInDto: SignInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      const ip = '127.0.0.1';

      // When
      const result = await service.signIn(signInDto, ip);

      // Then
      expect(result.success).toBeTruthy();
      expect(result.message).toBe('SUCCESS SIGN IN');
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('refreshToken');
    });

    it('로그인 일시와 IP를 기록한다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const ip = '127.0.0.1';

      const testUser = createSimpleUser('박상후', 'TestUser1');

      await userRepository.insert(testUser);

      const signInDto: SignInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      // When
      const now = new Date('2024-03-16 18:00:00');
      await service.signIn(signInDto, ip, now);
      const sut = await loginHistoryRepository.findOneBy({ userId: testUser.id });

      // Then
      expect(sut?.currentIp).toBe('127.0.0.1');
      expect(sut?.loginAt).toStrictEqual(now);
    });

    it('비밀번호가 정확하지 않은 경우 에러를 발생시킨다.', async () => {
      jest.spyOn(bcrypt, 'compare').mockReturnValue();

      const testUser = createSimpleUser('박상후', 'TestUser1');

      await userRepository.insert(testUser);

      const signInDto = new SignInDto();
      signInDto.username = '박상후';
      signInDto.password = 'wrongpassword';

      const ip = '127.0.0.1';

      // When, Then
      await expect(async () => {
        await service.signIn(signInDto, ip);
      }).rejects.toThrow(BadRequestException);
    });

    it('isAutoLogin = true 인 경우 refresh-token의 만료기간이 30d 이다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const testUser = createSimpleUser('박상후', 'TestUser1');

      await userRepository.insert(testUser);

      const signInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';
      signInDto.isAutoLogin = true;

      const ip = '127.0.0.1';

      const jwtSpy = jest.spyOn(jwtService, 'sign');

      // When
      await service.signIn(signInDto, ip);

      // Then
      expect(jwtSpy).toHaveBeenNthCalledWith(
        2, // refreshToken 생성은 두 번째 호출
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '30d',
        }),
      );
    });

    it('isAutoLogin undefined 인 경우 refresh-token의 만료기간이 1d 이다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const testUser = createSimpleUser('박상후', 'TestUser1');

      await userRepository.insert(testUser);

      const signInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      const ip = '127.0.0.1';

      const jwtSpy = jest.spyOn(jwtService, 'sign');

      // When
      await service.signIn(signInDto, ip);

      // Then
      expect(jwtSpy).toHaveBeenNthCalledWith(
        2, // refreshToken 생성은 두 번째 호출
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '1d',
        }),
      );
    });

    it('isAutoLogin = true 인 경우 member isAutoLogin = true로 업데이트한다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => Promise.resolve('token'));

      const testUser = createSimpleUser('박상후', 'TestUser1');

      await userRepository.insert(testUser);

      const signInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';
      signInDto.isAutoLogin = true;

      const ip = '127.0.0.1';

      const jwtSpy = jest.spyOn(jwtService, 'sign');

      // When
      await service.signIn(signInDto, ip);
      const sut = await userRepository.findOneBy({ id: testUser.id });

      // Then
      expect(sut.isAutoLogin).toBeTruthy();
    });

    it('isAutoLogin = undefined 인 경우 member isAutoLogin = false로 업데이트한다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => Promise.resolve('token'));

      const testUser = createSimpleUser('박상후', 'TestUser1');

      testUser.isAutoLogin = true;

      await userRepository.insert(testUser);

      const signInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      const ip = '127.0.0.1';

      const jwtSpy = jest.spyOn(jwtService, 'sign');

      // When
      await service.signIn(signInDto, ip);
      const sut = await userRepository.findOneBy({ id: testUser.id });

      // Then
      expect(sut.isAutoLogin).toBeFalsy();
    });
  });

  describe('refreshToken method test', () => {
    it('refreshToken 이 유효하지 않은 경우 UnauthorizedException을 발생한다.', async () => {
      // Given
      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => Promise.resolve(true));

      const refreshToken = 'refresh_token';

      const ip = '127.0.0.1';

      // When, Then
      await expect(service.refreshToken(refreshToken, ip)).rejects.toThrow(UnauthorizedException);
    });

    it('회원의 저장된 refresh_token과 입력한 refresh_token이 다른 경우 에러를 발생한다.', async () => {
      // Given
      const refreshToken = 'refresh_token';

      const testUser = createSimpleUser('박상후', 'TestUser1');
      testUser.refreshToken = 'invalid_refresh_token';

      const loginHistory = createLoginHistoryWithIpAndDate(testUser, '127.0.0.1', '2024-03-17 08:00:00');

      await userRepository.insert(testUser);
      await loginHistoryRepository.insert(loginHistory);

      const jwtPayload = {
        id: testUser.id,
        username: testUser.username,
        userType: UserType.GENERAL,
        userAttendance: [],
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(jwtPayload);

      const ip = '127.0.0.1';

      // When, Then
      await expect(async () => {
        await service.refreshToken(refreshToken, ip);
      }).rejects.toThrow(new UnauthorizedException('리프레시토큰이 유효하지 않습니다.'));
    });

    it('현재 ip와 마지막으로 로그인 한 ip가 다른 경우 에러를 발생한다.', async () => {
      // Given
      const refreshToken = 'refresh_token';

      const testUser = createSimpleUser('박상후', 'TestUser1');
      testUser.refreshToken = refreshToken;

      const loginHistory = createLoginHistoryWithIpAndDate(testUser, '127.0.0.1', '2024-03-17 08:00:00');

      await userRepository.insert(testUser);
      await loginHistoryRepository.insert(loginHistory);

      const jwtPayload: JwtPayload = {
        id: testUser.id,
        username: testUser.username,
        userType: UserType.GENERAL,
        userAttendance: [],
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(jwtPayload);

      const ip = '123.101.103.105';

      // When, Then
      await expect(async () => {
        await service.refreshToken(refreshToken, ip);
      }).rejects.toThrow(new UnauthorizedException('마지막으로 로그인 한 기기가 아닙니다.'));
    });

    it('회원이 가지고 있는 userAttendance 정보를 토큰에 담는다.', async () => {
      // Given
      const jwtSpy = jest.spyOn(jwtService, 'sign');

      const refreshToken = 'refresh_token';

      const attendance_1 = createAttendance('test_attendance_id_1', 'attendacne_title_1');
      const attendance_2 = createAttendance('test_attendance_id_2', 'attendacne_title_2');

      const userAttendance_1 = createAttendanceWithUserIdAndAttendanceId('test', 'test_attendance_id_1');
      const userAttendance_2 = createAttendanceWithUserIdAndAttendanceId('test', 'test_attendance_id_2');

      const testUser = createSimpleUser('박상후', 'TestUser1');
      testUser.refreshToken = refreshToken;
      testUser.userAttendance = [userAttendance_1, userAttendance_2];

      const loginHistory = createLoginHistoryWithIpAndDate(testUser, '127.0.0.1', '2024-03-17 08:00:00');

      await userRepository.insert(testUser);
      await loginHistoryRepository.insert(loginHistory);
      await attendanceRepository.insert([attendance_1, attendance_2]);
      await userAttendanceRepository.insert([userAttendance_1, userAttendance_2]);

      const jwtPayload = {
        id: testUser.id,
        username: testUser.username,
        userType: UserType.GENERAL,
        userAttendance: testUser.userAttendance,
      };

      const ip = '127.0.0.1';

      jest.spyOn(jwtService, 'verify').mockReturnValue(jwtPayload);

      // When
      await service.refreshToken(refreshToken, ip);

      // Then
      // spy 하고 있는 jwtService.sign 을 호출할 때의 payload 정보
      const mockCalledPayload = jwtSpy.mock.calls;

      mockCalledPayload.every((payload) => {
        expect(payload[0].userAttendance).toHaveLength(2);
        expect(payload[0].userAttendance.every((userAttendance) => userAttendance.userId === 'test')).toBe(true);
      });
    });
  });

  describe('isAvailableEmail method test', () => {
    it('이미 이메일이 존재하는 경우 false를 반환한다.', async () => {
      // Given
      const validationTargetEmail = 'myEmail@naver.com';

      const testUser = new User();
      testUser.email = 'myEmail@naver.com';
      testUser.id = 'test';
      testUser.name = '박상후';
      testUser.username = 'TestUser1';
      testUser.password = 'pwd123!@#';
      testUser.mobileNumber = '01080981398';
      testUser.createId = 'test';
      testUser.refreshToken = 'refresh_token';

      await userRepository.insert(testUser);

      // When
      const sut = await service.isAvailableEmail(validationTargetEmail);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBe(false);
    });

    it('이메일이 존재하지 않는 경우 true를 반환한다.', async () => {
      // Given
      const validationTargetEmail = 'myEmail@naver.com';

      // When
      const sut = await service.isAvailableEmail(validationTargetEmail);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBeTruthy();
    });
  });

  describe('isAvailableMobileNumber method test', () => {
    it('이미 핸드폰번호가 존재하는 경우 false를 반환한다.', async () => {
      // Given
      const validationTargetMobileNumber = '01080981398';

      const testUser = new User();
      testUser.mobileNumber = '01080981398';
      testUser.id = 'test';
      testUser.name = '박상후';
      testUser.username = 'TestUser1';
      testUser.password = 'pwd123!@#';
      testUser.email = 'myEmail@naver.com';
      testUser.createId = 'test';
      testUser.refreshToken = 'refresh_token';

      await userRepository.insert(testUser);

      // When
      const sut = await service.isAvailableMobileNumber(validationTargetMobileNumber);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBe(false);
    });

    it('핸드폰번호가 존재하지 않는 경우 true를 반환한다.', async () => {
      // Given
      const validationTargetMobileNumber = '01080981398';

      // When
      const sut = await service.isAvailableMobileNumber(validationTargetMobileNumber);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBe(true);
    });
  });

  async function setupTest() {}

  async function clear() {
    jest.restoreAllMocks(); // 각 테스트가 종료될 때 마다 jest의 모든 모의를 초기화
    await userAttendanceRepository.query('DELETE FROM user_attendance;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await loginHistoryRepository.query('DELETE FROM login_history;');
    await userRepository.query('DELETE FROM user;');
  }
});

function createAttendance(id: string, title: string) {
  const attendance = new Attendance();
  attendance.id = id;
  attendance.createId = 'test';
  attendance.type = AttendanceType.WEEKDAY;
  attendance.title = title;
  return attendance;
}

function createSimpleUser(name: string, username: string) {
  const testUser = new User();
  testUser.id = 'test';
  testUser.name = name;
  testUser.username = username;
  testUser.password = 'pwd123!@#';
  testUser.email = 'test@email.com';
  testUser.mobileNumber = '01080981398';
  testUser.createId = 'test';
  return testUser;
}

function createLoginHistoryWithIpAndDate(user: User, ip: string, date: string) {
  const loginHistory = new LoginHistory();
  loginHistory.id = 1;
  loginHistory.userId = 'test';
  loginHistory.user = user;
  loginHistory.currentIp = ip;
  loginHistory.loginAt = new Date(date);
  return loginHistory;
}

function createAttendanceWithUserIdAndAttendanceId(userId: string, attendanceId: string) {
  const userAttendance = new UserAttendance();
  userAttendance.userId = userId;
  userAttendance.attendanceId = attendanceId;
  userAttendance.role = RoleType.MASTER;
  userAttendance.createId = userId;
  return userAttendance;
}
