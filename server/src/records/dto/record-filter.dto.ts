import { Column } from 'typeorm';
import { AttendanceStatus } from '../record-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Record } from '../entities/record.entity';
import { Transform } from 'class-transformer';

export class RecordFilterDto {
  @IsEnum(AttendanceStatus)
  @IsOptional()
  @ApiProperty({
    description: '출석 기록 상태',
    type: 'enum',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: '출석날짜',
    type: 'date',
    example: '2024-12-03',
  })
  date: string;

  @IsEnum(DayType)
  @ApiProperty({
    description: '출석요일',
    type: 'enum',
    enum: DayType,
    example: DayType.MONDAY,
  })
  day: DayType;
}
