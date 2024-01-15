import { Column } from 'typeorm';
import { AttendanceStatus } from '../record-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Record } from '../entities/record.entity';
import { Transform } from 'class-transformer';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 PK',
    type: 'string',
    example: 'uuid-1234-uuid',
  })
  attendanceId: string;

  @IsEnum(AttendanceStatus)
  @ApiProperty({
    description: '출석 기록 상태',
    type: 'enum',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @IsString()
  @ApiProperty({
    description: '출석 대상 PK',
    type: 'string',
    example: 'uuid-123123',
  })
  attendeeId: string;

  @IsDate()
  @ApiProperty({
    description: '출석시간',
    type: 'datetime',
    example: '2024-12-03T00:00:12Z',
  })
  @Transform(({ value }) => new Date(value))
  datetime: Date;

  @IsEnum(DayType)
  @ApiProperty({
    description: '출석요일',
    type: 'enum',
    enum: DayType,
    example: DayType.MONDAY,
  })
  day: DayType;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '지각사유',
    type: 'text',
    example: '이래저래 늦었습니다',
  })
  lateReason: string;

  createdAt: Date;

  toEntity(createId: string) {
    const record = new Record();
    record.status = this.status;
    record.datetime = this.datetime;
    record.day = this.day;
    record.attendeeId = this.attendeeId;
    record.createId = createId;
    record.lateReason = this?.lateReason;
    record.createdAt = this.createdAt ?? new Date();
    return record;
  }
}
