import { Column } from 'typeorm';
import { AttendanceStatus } from '../record-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Record } from '../entities/record.entity';
import { Transform } from 'class-transformer';
import { Pagination } from '../../common/pagination';

export class RecordFilterDto extends Pagination {
  @IsEnum(AttendanceStatus)
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석 기록 상태',
    type: 'enum',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
    nullable: true,
  })
  status: AttendanceStatus;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석날짜',
    type: 'date',
    example: '2024-12-03',
    nullable: true,
  })
  date: string;

  @IsEnum(DayType)
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석요일',
    type: 'enum',
    enum: DayType,
    example: DayType.MONDAY,
    nullable: true,
  })
  day: DayType;
}
