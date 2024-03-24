import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TestModule } from '../../../src/test.module';
import { User } from '../../../src/users/entities/user.entity';
import { LoginHistory } from '../../../src/auth/entity/login-history.entity';
import { AuthService } from '../../../src/auth/auth.service';
import { UserType } from '../../../src/users/const/user-type.enum';
import { UsersService } from '../../../src/users/users.service';
import { BadRequestException } from '@nestjs/common';

describe('UserService Test', () => {
  let module: TestingModule;
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([User])],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
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

  describe('softDelete method test', () => {
    it('입력한 id의 데이터를 softDelete 한다.', async () => {
      // Given
      const user = createSimpleGeneralUser('test_id_1', 'pwd123!@#', '박상후', '01080981398');

      const createResult = await userRepository.insert(user);

      const userId = createResult.identifiers[0].id;

      // When
      const sut = await service.softDelete(userId, userId);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS DELETE USER');
    });

    it('soft delete한 id는 조회되지 않는다.', async () => {
      // Given
      const user = createSimpleGeneralUser('test_id_1', 'pwd123!@#', '박상후', '01080981398');

      const createResult = await userRepository.insert(user);

      const userId = createResult.identifiers[0].id;

      // When
      await service.softDelete(userId, userId);
      const sut = await userRepository.findOneBy({ id: userId });

      // Then
      expect(sut).toBe(null);
    });

    it('로그인한 회원의 id가 아닌 경우 BadRequest 에러를 발생시킨다..', async () => {
      // Given
      const user = createSimpleGeneralUser('test_id_1', 'pwd123!@#', '박상후', '01080981398');

      const createResult = await userRepository.insert(user);

      const userId = createResult.identifiers[0].id;

      const loginId = 'invalidId';

      // When , Then
      await expect(async () => await service.softDelete(userId, loginId)).rejects.toThrow(
        new BadRequestException('본인의 아이디만 삭제 가능합니다.'),
      );
    });
  });

  async function setupTest() {}

  async function clear() {
    jest.restoreAllMocks(); // 각 테스트가 종료될 때 마다 jest의 모든 모의를 초기화
    await userRepository.query('DELETE FROM user;');
  }
});

function createSimpleGeneralUser(username: string, password: string, name: string, mobileNumber: string) {
  const user = new User();
  user.type = UserType.GENERAL;
  user.username = username;
  user.password = password;
  user.name = name;
  user.mobileNumber = mobileNumber;
  user.createId = username;
  return user;
}
