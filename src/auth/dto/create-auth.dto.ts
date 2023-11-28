import { Column } from 'typeorm';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches('/^[가-힣a-zA-Z0-9]+$/')
  id: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches('/^[a-zA-Z0-9!@#$%]+$/')
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches('/^[가-힣a-zA-Z0-9]+$/')
  name: string;

  @IsString()
  @Matches('/^01[01]{1}-\\d{3,4}-\\d{4}$/')
  phoneNumber: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  @IsEmail()
  @Matches('/^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$/')
  email?: string;
}
