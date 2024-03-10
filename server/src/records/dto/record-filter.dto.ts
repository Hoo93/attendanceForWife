import { Column } from 'typeorm';
import { AttendanceStatus } from '../record-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString, Matches, Max, Min } from 'class-validator';
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

  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ description: '조회 년도', type: 'number', nullable: true })
  year: number;

  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ description: '조회 월', type: 'number', nullable: true })
  month: number;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: '조회 시작일', type: 'string', nullable: true })
  dateFrom: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: '조회 종료일', type: 'string', nullable: true })
  dateTo: string;
}
