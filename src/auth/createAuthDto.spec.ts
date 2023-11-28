import { plainToClass, plainToInstance } from 'class-transformer';
import { CreateAuthDto } from './dto/create-auth.dto';
import { validate } from 'class-validator';

describe('create-auth.dto TEST', () => {
  let createAuthDto;

  beforeEach(() => {
    const dto = {
      id: 'testID',
      password: 'testpwd123',
      name: 'testname',
      phoneNumber: '010-8098-1398',
      age: 31,
      email: 'sksk8922@gmail.com',
    };
    createAuthDto = plainToInstance(CreateAuthDto, dto);
  });

  it('validate method return ValidateError', async () => {
    const validationErrors = await validate(createAuthDto);
    expect(validationErrors.length).toBe(0);
  });

  it.each([
    ['short', 1],
    ['maxLengthIs12', 1],
    ['NoSpecial!@', 1],
    ['UseNum&Alpha', 1],
  ])('If name is %s should return %p', async (name, errorLength) => {
    createAuthDto.name = name;
    const validationErrors = await validate(createAuthDto);
    expect(validationErrors.length).toBe(errorLength);
  });
});
