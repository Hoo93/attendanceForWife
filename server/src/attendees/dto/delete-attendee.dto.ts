import { PartialType } from '@nestjs/swagger';
import { CreateAttendeeDto } from './create-attendee.dto';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DeleteAttendeeDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  ids: string[];

  @IsString()
  attendanceId: string;
}
