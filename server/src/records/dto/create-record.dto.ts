import { Column } from 'typeorm';
import { AttendanceStatus } from '../record-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import { IsDate, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { Record } from '../entities/record.entity';

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

  toEntity(createId: string) {
    const record = new Record();
    record.status = this.status;
    record.datetime = this.datetime;
    record.day = this.day;
    record.attendeeId = this.attendeeId;
    record.createId = createId;
    record.lateReason = this?.lateReason;
    return record;
  }
}
