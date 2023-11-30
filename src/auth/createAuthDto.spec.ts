import { plainToInstance } from 'class-transformer';
import { CreateAuthDto } from './dto/create-auth.dto';
import { validate, ValidationError } from 'class-validator';
import {
  INVALID_ID_MIN_LENGTH_MESSAGE,
  INVALID_NAME_MIN_LENGTH_MESSAGE,
} from './const/error-message';

describe('create-auth.dto TEST', () => {
  let createAuthDto;

  beforeEach(() => {
    const dto = {
      id: 'testID',
      password: 'testpwd123!',
      name: 'testname',
      phoneNumber: '010-8098-1398',
      age: 31,
      email: 'sksk8922@gmail.com',
    };
    createAuthDto = plainToInstance(CreateAuthDto, dto);
  });

  it('이름은 6글자 이상이어야 합니', async () => {
    const tooShortName = 'short';
    createAuthDto.name = tooShortName;

    const validationErrors = await validate(createAuthDto);
    console.log(validationErrors[0]);
    expect(validationErrors[0].constraints.minLength).toBe(
      INVALID_NAME_MIN_LENGTH_MESSAGE,
    );
  });
});
