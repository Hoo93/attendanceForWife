import { plainToInstance } from 'class-transformer';
import { CreateAuthDto } from './dto/create-auth.dto';
import { validate, ValidationError } from 'class-validator';
import {
  INVALID_ID_MAX_LENGTH_MESSAGE,
  INVALID_ID_MESSAGE,
  INVALID_ID_MIN_LENGTH_MESSAGE,
  INVALID_NAME_MAX_LENGTH_MESSAGE,
  INVALID_NAME_MESSAGE,
  INVALID_NAME_MIN_LENGTH_MESSAGE,
  INVALID_PASSWORD_MAX_LENGTH_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  INVALID_PASSWORD_MIN_LENGTH_MESSAGE,
  INVALID_PHONENUMBER_MESSAGE,
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

  it('이름은 6글자 이상이어야 합니다.', async () => {
    const tooShortName = 'short';
    createAuthDto.name = tooShortName;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.minLength).toBe(
      INVALID_NAME_MIN_LENGTH_MESSAGE,
    );
  });

  it('이름은 12글자 이하이어야 합니다.', async () => {
    const tooLongName = 'abcd123456789';
    createAuthDto.name = tooLongName;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.maxLength).toBe(
      INVALID_NAME_MAX_LENGTH_MESSAGE,
    );
  });

  it('이름은 한글,영문,숫자로 이루어져야 합니다.', async () => {
    const invalidName = 'noSpecial#';
    createAuthDto.name = invalidName;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_NAME_MESSAGE);
  });

  it('비밀번호는 각각 최소 1개 이상의 한글,영문,숫자로 이루어져야 합니다.', async () => {
    const invalidPassword = 'noSpecial#';
    createAuthDto.password = invalidPassword;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.matches).toBe(
      INVALID_PASSWORD_MESSAGE,
    );
  });

  it('비밀번호는 6글자 이상이어야 합니다.', async () => {
    const tooShortPassword = 'a1#';
    createAuthDto.password = tooShortPassword;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.minLength).toBe(
      INVALID_PASSWORD_MIN_LENGTH_MESSAGE,
    );
  });

  it('비밀번호는 12글자 이하이어야 합니다.', async () => {
    const tooLongPassword = 'abcd123456789!';
    createAuthDto.password = tooLongPassword;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.maxLength).toBe(
      INVALID_PASSWORD_MAX_LENGTH_MESSAGE,
    );
  });

  it('아이디는 영문,숫자로 이루어져야 합니다.', async () => {
    const invalidId = 'noSpecial#';
    createAuthDto.id = invalidId;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_ID_MESSAGE);
  });

  it('아이디는 6글자 이상이어야 합니다.', async () => {
    const tooShortId = 'a1#';
    createAuthDto.id = tooShortId;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.minLength).toBe(
      INVALID_ID_MIN_LENGTH_MESSAGE,
    );
  });

  it('아이디는 12글자 이하이어야 합니다.', async () => {
    const tooLongId = 'abcd123456789!';
    createAuthDto.id = tooLongId;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.maxLength).toBe(
      INVALID_ID_MAX_LENGTH_MESSAGE,
    );
  });

  it('핸드폰 번호는 01X-XXXX-XXXX 형식이어야 합니다.', async () => {
    const invalidPhoneNumber = '01080981398';
    createAuthDto.phoneNumber = invalidPhoneNumber;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.matches).toBe(
      INVALID_PHONENUMBER_MESSAGE,
    );
  });
});
