import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAttendeeDto } from './create-attendee.dto';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class DeleteAttendeeDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: '출석대상 ID 배열',
    type: 'Array',
    example: ['1', '2', '3'],
  })
  ids: string[];

  @IsString()
  @ApiProperty({
    description: '출석부 ID',
    type: 'string',
    example: 'attendanceId',
  })
  attendanceId: string;
}
