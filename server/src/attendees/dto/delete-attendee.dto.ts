import { PartialType } from '@nestjs/swagger';
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
  ids: string[];

  @IsString()
  attendanceId: string;
}
