import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/users/entities/user.entity';
import { MockUserRepository } from './mockUserRepository';
import { Test, TestingModule } from '@nestjs/testing';
import { MockJwtService } from './mockJwtService';
import { UsersService } from '../../../src/users/users.service';
import { Pagination } from '../../../src/common/pagination';

// type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;
// const mockRepository = () => ({
//   findOne: jest.fn(),
//   save: jest.fn(),
//   create: jest.fn(),
// });
describe('UserService Test', function () {
  let service: UsersService;
  let userRepository: MockUserRepository;
  let jwtService: MockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockUserRepository>(getRepositoryToken(User));
  });

  it('usersService should be defined', function () {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('findOneById should returns exact user', async () => {
    const id = 'TEST_1';

    const user = await service.findOneById(id);

    expect(user.id).toBe(id);
  });

  it('findAll returns all users', async () => {
    const pagination: Pagination = {
      skip: 0,
      take: 2,
    };
    const result = await service.findAll(pagination);

    expect(result.count).toBe(3);
    expect(result.list.length).toBe(2);
  });
});
