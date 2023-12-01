import { getRepositoryToken, InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { NestContainer } from "@nestjs/core";
import { MockUserRepository } from "./mockUserRepository";
import { Test, TestingModule } from "@nestjs/testing";
import { types } from "util";
import { AuthService } from "./auth.service";

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});
describe("AuthService Test", function() {

  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module:TestingModule = await Test.createTestingModule({
      providers:[
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass:MockUserRepository
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
    // userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('authService should be defined', function() {
    expect(service).toBeDefined()
    expect(service.validateUser).toBeDefined()
    expect(service.signup).toBeDefined()
  })


})