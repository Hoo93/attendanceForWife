import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TestModule } from '../../../src/test.module';
import { User } from '../../../src/users/entities/user.entity';
import { LoginHistory } from '../../../src/auth/entity/login-history.entity';
import { AuthService } from '../../../src/auth/auth.service';
import { UserType } from '../../../src/users/user-type.enum';
import { UsersService } from '../../../src/users/users.service';

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

      const userId = createResult.raw.id;

      // When
      const sut = await service.softDelete(userId);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS DELETE USER');
    });

    it('입력한 id의 데이터를 softDelete 한다.', async () => {
      // Given
      const user = createSimpleGeneralUser('test_id_1', 'pwd123!@#', '박상후', '01080981398');

      const createResult = await userRepository.insert(user);

      const userId = createResult.raw.id;

      // When
      await service.softDelete(userId);
      const sut = await userRepository.findOneBy({ id: userId });

      // Then
      expect(sut).toBe(null);
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
