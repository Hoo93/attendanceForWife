import { Column } from 'typeorm';
import { AttendanceStatus } from '../record-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import { IsDate, IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class CreateRecordDto {
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsString()
  attendeeId: string;

  @IsDate()
  datetime: string;

  @IsEnum(DayType)
  day: DayType;

  @IsOptional()
  @IsString()
  lateReason: string;
}
