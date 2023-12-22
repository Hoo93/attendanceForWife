import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {} from '../../auth/const/error-message';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { AttendanceType } from '../attendance-type.enum';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 제목',
    type: 'string',
    example: 'attendance title',
  })
  title: string;

  @IsString()
  @Optional()
  @ApiProperty({
    description: '출석부 설명',
    type: 'string',
    example: 'attendance description',
  })
  description: string;

  @IsEnum(AttendanceType)
  @ApiProperty({
    description: '출석부 타입',
    type: AttendanceType,
  })
  type: AttendanceType;
}
