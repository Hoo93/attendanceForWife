import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  INVALID_BIRTHDAY_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_ID_MAX_LENGTH_MESSAGE,
  INVALID_ID_MESSAGE,
  INVALID_ID_MIN_LENGTH_MESSAGE,
  INVALID_MOBILENUMBER_MESSAGE,
  INVALID_NAME_MAX_LENGTH_MESSAGE,
  INVALID_NAME_MESSAGE,
  INVALID_NAME_MIN_LENGTH_MESSAGE,
  INVALID_PASSWORD_MAX_LENGTH_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  INVALID_PASSWORD_MIN_LENGTH_MESSAGE,
} from '../const/error-message';
import { User } from '../../users/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsString()
  @MinLength(6, { message: INVALID_ID_MIN_LENGTH_MESSAGE })
  @MaxLength(12, { message: INVALID_ID_MAX_LENGTH_MESSAGE })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: INVALID_ID_MESSAGE,
  })
  @ApiProperty({
    description: '회원 아이디',
    type: 'string',
    example: 'testID',
  })
  id: string;

  @IsString()
  @MinLength(6, { message: INVALID_PASSWORD_MIN_LENGTH_MESSAGE })
  @MaxLength(12, { message: INVALID_PASSWORD_MAX_LENGTH_MESSAGE })
  @Matches(/^(?=.*?[a-zA-Z])(?=.*?\d)(?=.*?[!@#$%^&*]).{6,13}$/, {
    message: INVALID_PASSWORD_MESSAGE,
  })
  @ApiProperty({
    description: '회원 비밀번호',
    type: 'string',
    example: 'pwd123!@#',
  })
  password: string;

  @IsString()
  @MinLength(2, { message: INVALID_NAME_MIN_LENGTH_MESSAGE })
  @MaxLength(20, { message: INVALID_NAME_MAX_LENGTH_MESSAGE })
  @Matches(/^[가-힣a-zA-Z0-9]+$/, {
    message: INVALID_NAME_MESSAGE,
  })
  @ApiProperty({ description: '회원 이름', type: 'string', example: '이승형' })
  name: string;

  @IsString()
  @Matches(/^01[01]{1}-\d{3,4}-\d{4}$/, {
    message: INVALID_MOBILENUMBER_MESSAGE,
  })
  @ApiProperty({
    description: '회원 전화번호',
    type: 'string',
    example: '010-2647-8104',
  })
  mobileNumber: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{6}$/, {
    message: INVALID_BIRTHDAY_MESSAGE,
  })
  @ApiPropertyOptional({
    description: '회원 생년월일',
    type: 'string',
    example: '930519',
  })
  birthday?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @Matches(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, {
    message: INVALID_EMAIL_MESSAGE,
  })
  @ApiPropertyOptional({
    description: '회원 이메일',
    type: 'string',
    example: 'leetmdgud@naver.com',
  })
  email?: string;

  toEntity() {
    const user = new User();
    user.id = this.id;
    user.password = this.password;
    user.name = this.name;
    user.mobileNumber = this.mobileNumber;
    user.email = this?.email || null;
    user.birthday = this?.birthday || null;
    user.createId = this.id;
    return user;
  }
}
