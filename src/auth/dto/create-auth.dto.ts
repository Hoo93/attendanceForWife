import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  INVALID_EMAIL_MESSAGE,
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
} from '../const/error-message';
import { User } from '../../users/entities/user.entity';

export class CreateAuthDto {
  @IsString()
  @MinLength(6, { message: INVALID_ID_MIN_LENGTH_MESSAGE })
  @MaxLength(12, { message: INVALID_ID_MAX_LENGTH_MESSAGE })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: INVALID_ID_MESSAGE,
  })
  public id: string;

  @IsString()
  @MinLength(6, { message: INVALID_PASSWORD_MIN_LENGTH_MESSAGE })
  @MaxLength(12, { message: INVALID_PASSWORD_MAX_LENGTH_MESSAGE })
  @Matches(/^(?=.*?[a-zA-Z])(?=.*?\d)(?=.*?[!@#$%^&*]).{6,13}$/, {
    message: INVALID_PASSWORD_MESSAGE,
  })
  public password: string;

  @IsString()
  @MinLength(6, { message: INVALID_NAME_MIN_LENGTH_MESSAGE })
  @MaxLength(12, { message: INVALID_NAME_MAX_LENGTH_MESSAGE })
  @Matches(/^[가-힣a-zA-Z0-9]+$/, {
    message: INVALID_NAME_MESSAGE,
  })
  public name: string;

  @IsString()
  @Matches(/^01[01]{1}-\d{3,4}-\d{4}$/, {
    message: INVALID_PHONENUMBER_MESSAGE,
  })
  public phoneNumber: string;

  @IsNumber()
  @IsOptional()
  public age?: number;

  @IsString()
  @IsOptional()
  @IsEmail()
  @Matches(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, {
    message: INVALID_EMAIL_MESSAGE,
  })
  public email?: string;

  public toEntity() {
    const user = new User();
    user.id = this.id;
    user.password = this.password;
    user.name = this.name;
    user.phoneNumber = this.phoneNumber;
    user.email = this?.email || null;
    user.age = this?.age || null;
    return user;
  }
}
