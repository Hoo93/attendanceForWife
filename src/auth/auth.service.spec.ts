import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { MockUserRepository } from './mockUserRepository';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

// type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;
// const mockRepository = () => ({
//   findOne: jest.fn(),
//   save: jest.fn(),
//   create: jest.fn(),
// });
describe('AuthService Test', function () {
  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('authService should be defined', function () {
    expect(service).toBeDefined();
    expect(service.validateUser).toBeDefined();
    expect(service.signup).toBeDefined();
  });

  it('signup return User without password', async () => {
    const dto = new CreateAuthDto();
    dto.id = 'testID';
    dto.password = 'testpwd123!';
    dto.name = 'testname';
    dto.mobileNumber = '010-8098-1398';
    dto.birthday = '931117';
    dto.email = 'sksk8922@gmail.com';

    const signupResult = await service.signup(dto);
    expect(signupResult.id).toBe(dto.id);
    expect(signupResult.name).toBe(dto.name);
    expect(signupResult.mobileNumber).toBe(dto.mobileNumber);
    expect(signupResult.birthday).toBe(dto.birthday);
    expect(signupResult.email).toBe(dto.email);

    expect(signupResult.password).not.toBeDefined();
  });
});
